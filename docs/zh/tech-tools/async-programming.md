# JavaScript 异步编程：Promise 与 async/await

JavaScript 是单线程语言，但真实业务中有大量耗时操作，例如网络请求、文件读取、定时器、动画、数据库访问等。如果这些操作都同步执行，页面或服务就会被阻塞。异步编程的核心目的就是：把耗时任务交出去，主线程继续执行，等任务完成后再回来处理结果。

在现代 JavaScript 中，异步编程主要依赖 `Promise`、`async/await`，以及事件循环中的宏任务和微任务机制。

## 为什么需要异步

同步代码会按顺序一行一行执行：

```js
console.log('start')
const result = heavyTask()
console.log(result)
console.log('end')
```

如果 `heavyTask()` 很慢，后面的代码就必须等待。异步代码则把耗时任务放到未来处理：

```js
console.log('start')

setTimeout(() => {
  console.log('task done')
}, 1000)

console.log('end')
```

输出顺序是：

```txt
start
end
task done
```

这说明异步任务不会立即阻塞主流程。

## 事件循环的基本原理

JavaScript 运行时通常包含：

- **调用栈 Call Stack**：执行当前同步代码。
- **Web APIs / Node APIs**：处理定时器、网络请求、文件 I/O 等异步能力。
- **任务队列 Task Queue**：保存等待执行的回调。
- **微任务队列 Microtask Queue**：保存 `Promise.then`、`queueMicrotask` 等微任务。
- **事件循环 Event Loop**：不断检查调用栈是否为空，并把队列中的任务放回调用栈执行。

执行规则可以简化为：

1. 先执行所有同步代码。
2. 同步代码执行完后，清空微任务队列。
3. 执行一个宏任务。
4. 再清空微任务队列。
5. 不断重复。

示例：

```js
console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise then')
})

console.log('script end')
```

输出结果：

```txt
script start
script end
promise then
setTimeout
```

原因是同步代码先执行，`Promise.then` 属于微任务，`setTimeout` 属于宏任务；微任务优先于下一个宏任务执行。

## 回调函数的问题

早期异步代码常用回调函数：

```js
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetail(orders[0].id, (detail) => {
      console.log(detail)
    })
  })
})
```

这种写法的问题：

- 嵌套层级越来越深，形成“回调地狱”。
- 错误处理分散，每一层都要处理失败。
- 控制流程不清晰，阅读和维护成本高。
- 串行和并行关系不直观。

`Promise` 的出现就是为了让异步流程更容易组合和管理。

## Promise 是什么

`Promise` 是一个表示“未来结果”的对象。它不一定马上有值，但最终会进入成功或失败状态。

Promise 有三种状态：

| 状态 | 说明 |
| :--- | :--- |
| `pending` | 初始状态，任务还没有完成 |
| `fulfilled` | 任务成功完成 |
| `rejected` | 任务失败 |

状态一旦从 `pending` 变成 `fulfilled` 或 `rejected`，就不能再改变。

## 创建 Promise

```js
const promise = new Promise((resolve, reject) => {
  const success = true

  setTimeout(() => {
    if (success) {
      resolve('任务成功')
    }
    else {
      reject(new Error('任务失败'))
    }
  }, 1000)
})
```

`resolve` 用来把 Promise 变成成功状态，`reject` 用来把 Promise 变成失败状态。

## 使用 then、catch、finally

```js
promise
  .then((result) => {
    console.log('成功:', result)
  })
  .catch((error) => {
    console.error('失败:', error)
  })
  .finally(() => {
    console.log('无论成功失败都会执行')
  })
```

含义：

- `then`：处理成功结果。
- `catch`：处理错误。
- `finally`：做收尾工作，例如关闭 loading、释放资源。

## Promise 链式调用

`then` 会返回一个新的 Promise，所以可以链式调用：

```js
fetchUser()
  .then((user) => {
    return fetchOrders(user.id)
  })
  .then((orders) => {
    return fetchOrderDetail(orders[0].id)
  })
  .then((detail) => {
    console.log(detail)
  })
  .catch((error) => {
    console.error(error)
  })
```

链式调用的好处是把嵌套结构拉平，让异步流程更接近同步阅读顺序。

## Promise 的错误传播

Promise 链中只要某一步抛错，后续普通 `then` 会被跳过，错误会进入最近的 `catch`：

```js
Promise.resolve()
  .then(() => {
    throw new Error('第一步失败')
  })
  .then(() => {
    console.log('不会执行')
  })
  .catch((error) => {
    console.error(error.message)
  })
```

这让错误处理可以集中在链尾，而不是每一步都重复处理。

## 常用 Promise 静态方法

### Promise.resolve

把普通值包装成成功的 Promise：

```js
Promise.resolve(1).then(console.log)
```

### Promise.reject

创建一个失败的 Promise：

```js
Promise.reject(new Error('失败')).catch(console.error)
```

### Promise.all

多个异步任务全部成功后才成功，只要一个失败就整体失败：

```js
const [user, orders, profile] = await Promise.all([
  fetchUser(),
  fetchOrders(),
  fetchProfile(),
])
```

适合多个任务互不依赖、可以并行执行的场景。

### Promise.allSettled

等待所有任务结束，不管成功还是失败：

```js
const results = await Promise.allSettled([
  fetchUser(),
  fetchOrders(),
  fetchProfile(),
])

for (const result of results) {
  if (result.status === 'fulfilled') {
    console.log(result.value)
  }
  else {
    console.error(result.reason)
  }
}
```

适合批量任务、部分失败也要继续展示结果的场景。

### Promise.race

谁先完成就使用谁的结果，不区分成功或失败：

```js
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('请求超时')), 5000)
})

await Promise.race([
  fetchData(),
  timeout,
])
```

常用于超时控制。

### Promise.any

只要有一个任务成功就成功，全部失败才失败：

```js
const data = await Promise.any([
  fetchFromMirrorA(),
  fetchFromMirrorB(),
  fetchFromMirrorC(),
])
```

适合多源容灾或镜像请求。

## async/await 是什么

`async/await` 是基于 Promise 的语法糖。它让异步代码看起来像同步代码，更容易阅读。

```js
async function loadData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  return orders
}
```

规则：

- `async` 函数一定返回 Promise。
- `await` 后面通常跟一个 Promise。
- `await` 会暂停当前 `async` 函数的后续执行，等待 Promise 完成。
- `await` 只能直接写在 `async` 函数中，或在支持顶层 await 的模块里使用。

## async 函数的返回值

即使返回普通值，也会被包装成 Promise：

```js
async function getNumber() {
  return 1
}

getNumber().then(console.log)
```

等价于：

```js
function getNumber() {
  return Promise.resolve(1)
}
```

如果 `async` 函数抛错，会变成 rejected Promise：

```js
async function run() {
  throw new Error('出错了')
}

run().catch(console.error)
```

## await 的执行顺序

```js
async function run() {
  console.log('A')
  await Promise.resolve()
  console.log('B')
}

console.log('C')
run()
console.log('D')
```

输出：

```txt
C
A
D
B
```

`await` 后面的代码会进入微任务队列，所以 `B` 会在同步代码 `D` 之后执行。

## 使用 try/catch 处理错误

`async/await` 中推荐用 `try/catch` 处理错误：

```js
async function loadUser() {
  try {
    const user = await fetchUser()
    return user
  }
  catch (error) {
    console.error('加载用户失败:', error)
    throw error
  }
  finally {
    hideLoading()
  }
}
```

如果当前函数不能真正处理错误，可以记录上下文后继续 `throw`，让上层决定如何处理。

## 串行与并行

### 串行执行

后一个任务依赖前一个任务结果时，用串行：

```js
const user = await fetchUser()
const orders = await fetchOrders(user.id)
const detail = await fetchOrderDetail(orders[0].id)
```

### 并行执行

任务之间没有依赖时，用并行：

```js
const userPromise = fetchUser()
const configPromise = fetchConfig()

const [user, config] = await Promise.all([
  userPromise,
  configPromise,
])
```

或者直接写：

```js
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig(),
])
```

不要把无依赖任务写成无意义的串行：

```js
// 不推荐：两个请求互不依赖，却被串行等待
const user = await fetchUser()
const config = await fetchConfig()
```

## 控制并发数量

如果一次性发起太多请求，可能会造成浏览器连接数、后端服务或第三方 API 压力过大。可以做简单并发控制：

```js
async function runWithLimit(tasks, limit = 3) {
  const results = []
  const executing = []

  for (const task of tasks) {
    const promise = Promise.resolve().then(() => task())
    results.push(promise)

    if (limit <= tasks.length) {
      const clean = promise.finally(() => {
        executing.splice(executing.indexOf(clean), 1)
      })

      executing.push(clean)

      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
  }

  return Promise.all(results)
}
```

使用方式：

```js
const tasks = urls.map(url => () => fetch(url))
const responses = await runWithLimit(tasks, 3)
```

实际项目中也可以使用成熟工具库来处理并发控制。

## 取消异步任务

Promise 本身没有内置取消能力，但很多 Web API 支持 `AbortController`：

```js
const controller = new AbortController()

const request = fetch('/api/user', {
  signal: controller.signal,
})

setTimeout(() => {
  controller.abort()
}, 3000)

try {
  const response = await request
  const data = await response.json()
  console.log(data)
}
catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求已取消')
  }
  else {
    throw error
  }
}
```

常见场景：

- 页面切换时取消未完成请求。
- 搜索输入变化时取消上一次请求。
- 给请求设置超时时间。
- 组件卸载时清理异步副作用。

## 常见错误

### 忘记 return Promise

```js
// 错误：外层链不会等待 fetchUser
function load() {
  fetchUser().then(console.log)
}
```

应改为：

```js
function load() {
  return fetchUser().then(console.log)
}
```

或：

```js
async function load() {
  const user = await fetchUser()
  console.log(user)
}
```

### 在 forEach 中使用 await

```js
// 不推荐
items.forEach(async (item) => {
  await saveItem(item)
})
```

`forEach` 不会等待内部的 async 回调。需要串行时使用 `for...of`：

```js
for (const item of items) {
  await saveItem(item)
}
```

需要并行时使用 `Promise.all`：

```js
await Promise.all(items.map(item => saveItem(item)))
```

### 吞掉错误

```js
try {
  await submit()
}
catch (error) {
  console.error(error)
}
```

如果当前层只记录错误但不提示用户、不恢复状态，也不继续抛出，调用方会误以为操作成功。更合理的方式是明确处理：

```js
try {
  await submit()
  showSuccess()
}
catch (error) {
  showError('提交失败，请稍后再试')
  throw error
}
```

### 不必要地混用 then 和 await

```js
// 可读性较差
const user = await fetchUser().then(user => normalizeUser(user))
```

可以改为：

```js
const rawUser = await fetchUser()
const user = normalizeUser(rawUser)
```

当然，在需要链式转换或复用 Promise 时，`then` 仍然是合理选择。

## 实战模式：封装请求函数

```js
async function request(url, options = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

async function getUser(id) {
  return request(`/api/users/${id}`)
}
```

调用：

```js
try {
  const user = await getUser(1)
  console.log(user)
}
catch (error) {
  console.error('获取用户失败:', error)
}
```

封装的价值：

- 统一处理 HTTP 状态码。
- 统一处理 JSON 解析。
- 统一加 Token、请求头、超时、错误提示。
- 让业务代码只关心数据。

## 实战模式：请求超时

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms)
  })
}

async function fetchWithTimeout(url, ms = 5000) {
  return Promise.race([
    fetch(url),
    timeout(ms),
  ])
}
```

更推荐结合 `AbortController`，让超时后真正取消请求：

```js
async function fetchWithAbortTimeout(url, ms = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)

  try {
    return await fetch(url, {
      signal: controller.signal,
    })
  }
  finally {
    clearTimeout(timer)
  }
}
```

## 最佳实践

- 有依赖关系用串行，没有依赖关系用 `Promise.all` 并行。
- 对用户可感知的操作必须处理 loading、成功、失败和重试。
- 不要在 `forEach` 中直接使用 `await`。
- 批量任务要考虑并发限制，避免瞬间打满服务。
- 错误要么被真正处理，要么继续向上抛出。
- 组件或页面销毁时要清理定时器、监听器和可取消请求。
- `Promise.all` 适合“全成功才继续”，`Promise.allSettled` 适合“允许部分失败”。
- `async/await` 负责提升可读性，Promise 负责描述和组合异步结果。

## 一句话总结

异步编程的本质是把耗时任务从当前执行流程中分离出去，再通过事件循环把结果带回来。`Promise` 提供了统一的异步结果模型，`async/await` 提供了更接近同步代码的写法。理解事件循环、微任务、错误传播、串行并行和取消机制，才能写出稳定、清晰、可维护的异步代码。
