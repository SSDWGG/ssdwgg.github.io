# Vue3 介绍与使用

Vue3 是 Vue 的现代版本，核心升级包括 Composition API、基于 Proxy 的响应式系统、更好的 TypeScript 支持、更快的编译和运行时性能，以及更适合大型项目的逻辑组织方式。

相比 Vue2，Vue3 不只是 API 写法变化，更重要的是底层响应式、编译优化、组件模型和生态工具链都有明显升级。

## Vue3 适合什么场景

- 新建中大型前端项目。
- 使用 TypeScript 的业务系统。
- 需要更好逻辑复用和组件抽象的项目。
- 需要更高性能、更小包体积的应用。
- 从 Vue2 逐步迁移到现代工程体系。

## 创建项目

```bash
pnpm create vue@latest
```

按提示选择 TypeScript、Router、Pinia、测试工具等选项。

启动项目：

```bash
pnpm install
pnpm dev
```

## 基础组件写法

Vue3 推荐使用 `<script setup>`：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value += 1
}
</script>

<template>
  <button @click="increment">
    当前数量：{{ count }}
  </button>
</template>
```

在模板中使用 `ref` 时会自动解包，所以模板里写 `count`，脚本里写 `count.value`。

## 响应式 API

### ref

`ref` 适合基本类型，也可以包裹对象：

```js
import { ref } from 'vue'

const title = ref('Hello Vue3')
const count = ref(0)
```

修改时：

```js
count.value += 1
```

### reactive

`reactive` 适合对象状态：

```js
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: '',
})
```

修改时可以直接写：

```js
form.username = 'admin'
```

### computed

```js
import { computed, ref } from 'vue'

const firstName = ref('Ada')
const lastName = ref('Lovelace')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
```

计算属性会缓存结果，依赖没有变化时不会重复计算。

### watch

```js
import { ref, watch } from 'vue'

const keyword = ref('')

watch(keyword, (newValue, oldValue) => {
  console.log('搜索词变化：', oldValue, newValue)
})
```

### watchEffect

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  console.log('当前数量：', count.value)
})
```

`watchEffect` 会自动收集内部读取到的响应式依赖，适合依赖关系简单但不想手动声明来源的场景。

## 组件通信

### defineProps

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <h2>{{ props.title }}</h2>
</template>
```

TypeScript 写法：

```vue
<script setup lang="ts">
defineProps<{
  title: string
  count?: number
}>()
</script>
```

### defineEmits

```vue
<script setup>
const emit = defineEmits(['submit'])

function submit() {
  emit('submit', { ok: true })
}
</script>
```

### defineModel

对于表单组件，可以用 `defineModel` 简化 `v-model` 封装：

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

## 生命周期

```js
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

Vue3 生命周期更适合和具体逻辑放在一起，不必像 Options API 那样分散在多个选项中。

## 逻辑复用：Composable

Composition API 的重要价值是把逻辑抽成普通函数：

```js
import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowWidth() {
  const width = ref(window.innerWidth)

  function updateWidth() {
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return {
    width,
  }
}
```

组件中使用：

```vue
<script setup>
import { useWindowWidth } from './useWindowWidth'

const { width } = useWindowWidth()
</script>
```

这类函数通常称为 `Composable`，类似 React 中的 Hook，但依赖 Vue 的响应式系统和生命周期上下文。

## 路由与状态管理

Vue3 常用组合：

- `Vue Router 4`
- `Pinia`
- `Vite`

Pinia 示例：

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count += 1
    },
  },
})
```

组件中使用：

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <button @click="counter.increment">
    {{ counter.count }}
  </button>
</template>
```

## 原理层理解

### 1. 响应式基于 Proxy

Vue3 使用 `Proxy` 代理对象，拦截读取、设置、删除、遍历等操作。

简化理解：

```js
function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key)
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      trigger(obj, key)
      return true
    },
  })
}
```

相比 Vue2 的 `Object.defineProperty`，`Proxy` 的优势是：

- 可以监听新增属性。
- 可以监听删除属性。
- 可以更好处理数组和集合类型。
- 不需要初始化时递归劫持所有属性。

### 2. track 和 trigger

Vue3 响应式核心可以抽象为：

- `track`：读取数据时收集依赖。
- `trigger`：修改数据时触发依赖更新。

当组件渲染读取 `count.value` 时，当前渲染副作用会被收集；当 `count.value` 改变时，相关组件会重新渲染。

### 3. effect 是响应式更新的执行单元

Vue3 内部会把组件渲染、计算属性、监听器等包装成响应式副作用。数据变化后，并不是直接操作 DOM，而是通知相关 effect 重新执行。

简化流程：

1. 渲染组件，读取响应式数据。
2. 收集当前渲染 effect 与数据的关系。
3. 数据变化，触发依赖。
4. 调度器安排组件更新。
5. 生成新的虚拟 DOM 并 patch 到页面。

### 4. 模板编译优化

Vue3 编译器会分析模板，把静态部分和动态部分区分开。

优化点包括：

- 静态节点提升：不会变化的节点只创建一次。
- Patch Flag：标记哪些地方是动态的。
- Block Tree：更新时更快定位动态节点。
- 事件缓存：避免重复创建不必要的事件函数。

这意味着 Vue3 不只是运行时更强，编译阶段也在帮助减少更新成本。

### 5. 虚拟 DOM 仍然存在，但更聪明

Vue3 依然使用虚拟 DOM，但通过编译期信息让 Diff 更精准。对于模板明确的场景，Vue3 可以知道“哪里可能变化”，不必像完全动态的虚拟 DOM 那样做更多猜测。

### 6. ref 为什么需要 .value

基本类型不是对象，无法直接用 `Proxy` 代理变量本身。因此 Vue3 用一个对象包装值：

```js
const count = {
  value: 0,
}
```

读取和修改都通过 `.value`，Vue 就能拦截访问并追踪依赖。

模板里不需要写 `.value`，是因为模板编译器做了自动解包。

## Vue2 与 Vue3 对比

| 维度 | Vue2 | Vue3 |
| :--- | :--- | :--- |
| 响应式 | `Object.defineProperty` | `Proxy` |
| 主要组织方式 | Options API | Composition API + Options API |
| TypeScript | 支持一般 | 支持更好 |
| 构建工具 | Vue CLI 常见 | Vite 常见 |
| 状态管理 | Vuex | Pinia |
| 性能优化 | 运行时 Diff 为主 | 编译优化 + 运行时优化 |
| 逻辑复用 | mixin、插件 | composable |

## 常见坑

- 在脚本中忘记写 `.value`。
- 直接解构 `reactive` 对象导致响应式丢失。
- 把所有状态都塞进一个巨大 `reactive`，导致维护困难。
- 在 `watchEffect` 中写入自己依赖的数据，造成循环触发。
- 把高频动画状态放进 Vue 响应式系统，造成不必要渲染。

如果需要解构响应式对象，可以使用：

```js
import { toRefs } from 'vue'

const state = reactive({ count: 0 })
const { count } = toRefs(state)
```

## 一句话总结

Vue3 的核心是基于 `Proxy` 的响应式系统、Composition API 的逻辑组织方式，以及编译器参与的性能优化；它更适合现代工程化、TypeScript 和复杂业务长期维护。
