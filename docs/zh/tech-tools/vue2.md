# Vue2 介绍与使用

Vue2 是 Vue 生态中非常经典的一代前端框架，核心特点是模板语法简单、双向绑定易用、Options API 清晰，曾长期用于后台管理系统、移动端 H5、企业官网和中大型业务系统。

虽然新项目更推荐 Vue3，但很多历史项目仍然运行在 Vue2 上。理解 Vue2 的使用方式和响应式原理，对维护老项目、迁移 Vue3、理解前端框架设计都很有价值。

## Vue2 适合什么场景

- 维护已有 Vue2 项目。
- 理解 Vue 早期响应式系统。
- 学习 Options API、模板编译、虚拟 DOM。
- 从 Vue2 项目逐步迁移到 Vue3。
- 阅读老项目中常见的 Vue CLI、Vuex、Vue Router 写法。

## 基础使用

### 创建实例

```html
<div id="app">
  <p>{{ message }}</p>
  <button @click="changeMessage">修改</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
<script>
  new Vue({
    el: '#app',
    data() {
      return {
        message: 'Hello Vue2',
      }
    },
    methods: {
      changeMessage() {
        this.message = 'Vue2 响应式更新'
      },
    },
  })
</script>
```

Vue2 通过 `new Vue()` 创建实例，使用 `el` 挂载到页面节点。

### 单文件组件

```vue
<template>
  <section class="counter">
    <p>当前数量：{{ count }}</p>
    <button @click="increment">+1</button>
  </section>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    increment() {
      this.count += 1
    },
  },
}
</script>
```

`data` 在组件中必须是函数，避免多个组件实例共享同一个对象。

## Options API

Vue2 主要使用 Options API，把组件逻辑拆到不同选项中：

| 选项 | 作用 |
| :--- | :--- |
| `data` | 定义响应式状态 |
| `computed` | 定义计算属性 |
| `watch` | 监听数据变化 |
| `methods` | 定义事件方法 |
| `props` | 接收父组件传入数据 |
| `components` | 注册子组件 |
| `created` / `mounted` | 生命周期钩子 |

### computed

```js
export default {
  data() {
    return {
      firstName: 'Ada',
      lastName: 'Lovelace',
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
  },
}
```

`computed` 有缓存，只有依赖变化时才会重新计算。

### watch

```js
export default {
  data() {
    return {
      keyword: '',
    }
  },
  watch: {
    keyword(newValue, oldValue) {
      console.log('搜索词变化：', oldValue, newValue)
    },
  },
}
```

`watch` 更适合处理副作用，例如请求接口、写入本地缓存、触发埋点。

## 组件通信

### 父传子：props

```vue
<template>
  <UserCard :name="userName" />
</template>
```

```js
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
```

### 子传父：事件

```vue
<template>
  <button @click="$emit('submit', form)">提交</button>
</template>
```

父组件监听：

```vue
<ChildForm @submit="handleSubmit" />
```

### 跨层级通信

常见方式：

- 简单场景：`provide` / `inject`
- 中大型项目：`Vuex`
- 事件总线：可以用，但复杂项目不推荐滥用

## 生命周期

Vue2 常见生命周期：

| 阶段 | 钩子 |
| :--- | :--- |
| 创建前后 | `beforeCreate`、`created` |
| 挂载前后 | `beforeMount`、`mounted` |
| 更新前后 | `beforeUpdate`、`updated` |
| 销毁前后 | `beforeDestroy`、`destroyed` |

常见使用习惯：

- `created`：适合初始化数据、发起不依赖 DOM 的请求。
- `mounted`：适合访问 DOM、初始化图表、挂载第三方库。
- `beforeDestroy`：适合清理定时器、事件监听、长连接。

## 路由和状态管理

Vue2 项目常见组合：

- `Vue Router 3`
- `Vuex 3`
- `Vue CLI`

路由示例：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
})
```

Vuex 示例：

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count += 1
    },
  },
})
```

## 原理层理解

### 1. 响应式基于 Object.defineProperty

Vue2 会在初始化时遍历 `data`，使用 `Object.defineProperty` 把属性转换成 getter / setter。

简化理解：

```js
function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(newValue) {
      value = newValue
      notifyUpdate()
    },
  })
}
```

当模板渲染读取数据时，会触发 getter 收集依赖；当数据修改时，会触发 setter 通知相关视图更新。

### 2. Dep 和 Watcher

Vue2 响应式系统中有两个关键角色：

- `Dep`：依赖管理器，记录谁依赖了当前数据。
- `Watcher`：观察者，代表一个需要更新的任务，例如组件渲染、计算属性、用户 watch。

流程可以理解为：

1. 组件渲染时读取 `message`。
2. `message` 的 getter 被触发。
3. 当前渲染 Watcher 被收集到 `message` 的 Dep 中。
4. 修改 `message` 时触发 setter。
5. Dep 通知 Watcher 更新。
6. Watcher 重新执行渲染逻辑。

### 3. 为什么 Vue2 检测不到某些变化

由于 Vue2 初始化时需要提前劫持属性，所以后来新增的对象属性默认不是响应式：

```js
this.user.age = 18
```

这种写法可能不会触发视图更新。应该使用：

```js
this.$set(this.user, 'age', 18)
```

数组也有类似限制。Vue2 通过重写数组的 `push`、`pop`、`splice` 等方法来触发更新，但直接通过索引修改可能不稳定：

```js
this.list[0] = 'new value'
```

推荐：

```js
this.$set(this.list, 0, 'new value')
```

### 4. 模板会编译成渲染函数

Vue2 的模板不是直接运行的。构建时或运行时会把模板编译成 render 函数：

```vue
<p>{{ message }}</p>
```

可以理解为：

```js
render() {
  return createElement('p', this.message)
}
```

组件更新时，render 函数生成新的虚拟 DOM，再与旧虚拟 DOM 对比，最后把变化更新到真实 DOM。

### 5. 虚拟 DOM 和 Diff

虚拟 DOM 是用 JavaScript 对象描述真实 DOM 结构。Vue2 数据变化后不会立即粗暴重建整个页面，而是：

1. 生成新的虚拟 DOM。
2. 与旧虚拟 DOM 做 Diff。
3. 找到最小变化。
4. 更新真实 DOM。

`key` 在列表渲染中非常重要，它能帮助 Diff 算法稳定识别节点身份。

```vue
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

## 常见坑

- 组件中的 `data` 写成对象，导致状态被多个实例共享。
- 新增对象属性不用 `Vue.set` 或 `this.$set`。
- 列表渲染使用数组下标当 `key`，导致复用错误。
- 在 `updated` 中无条件修改状态，造成循环更新。
- 没有在 `beforeDestroy` 清理定时器、事件和第三方实例。

## 迁移到 Vue3 的思路

- 优先升级周边生态，例如构建工具、路由、状态管理。
- 把复杂逻辑逐步抽离成可复用函数。
- 减少对全局 mixin、事件总线、隐式 this 的依赖。
- 新功能优先按 Vue3 的 Composition API 思路组织。

## 一句话总结

Vue2 的核心是基于 `Object.defineProperty` 的响应式系统、模板编译和虚拟 DOM 更新机制；它简单易用，但在新增属性、数组索引、逻辑复用和类型推导方面存在历史限制。
