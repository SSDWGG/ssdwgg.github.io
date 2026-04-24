# Three.js 介绍与使用

Three.js 是一个运行在浏览器中的 3D 图形库，它封装了 WebGL 的底层细节，让开发者可以用更高层的 API 创建 3D 场景、模型、灯光、材质、相机和动画。

如果直接写 WebGL，需要手动处理着色器、缓冲区、矩阵、纹理和渲染管线；Three.js 把这些能力抽象成更接近“搭建 3D 世界”的对象模型。

## 适合做什么

- 官网 3D 展示、产品模型展示、品牌视觉互动。
- 数据可视化、地图、粒子效果、空间图表。
- 3D 游戏原型、虚拟展厅、数字孪生场景。
- 加载 `glTF` / `GLB` 模型并在网页中交互展示。
- 与 GSAP、Vue、React 等结合制作复杂动效页面。

## 安装

```bash
pnpm add three
```

如果使用 npm：

```bash
npm install three
```

## 最小示例

```js
import * as THREE from 'three'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)
camera.position.z = 3

function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

这个示例包含 Three.js 最核心的几个对象：

- `Scene`：场景，类似 3D 世界的容器。
- `Camera`：相机，决定从哪里看、怎么看。
- `Renderer`：渲染器，把 3D 场景绘制到 Canvas 上。
- `Geometry`：几何体，决定形状。
- `Material`：材质，决定表面颜色、光照和纹理效果。
- `Mesh`：网格，几何体 + 材质的组合。

## 核心概念

### 场景 Scene

`Scene` 是所有 3D 对象的容器。模型、灯光、相机、辅助线都可以加入场景。

```js
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)
```

Three.js 内部会从场景根节点开始遍历对象树，计算每个对象的位置、变换和可见性，然后交给渲染器绘制。

### 相机 Camera

常用相机有两种：

| 相机 | 特点 | 适用场景 |
| :--- | :--- | :--- |
| PerspectiveCamera | 近大远小，符合人眼透视 | 产品展示、游戏、常规 3D 场景 |
| OrthographicCamera | 没有透视缩放 | 2.5D、工程图、等距视角、地图 |

透视相机示例：

```js
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
camera.position.set(0, 2, 5)
camera.lookAt(0, 0, 0)
```

参数含义：

- `fov`：视野角度。
- `aspect`：宽高比。
- `near`：最近可见距离。
- `far`：最远可见距离。

### 渲染器 Renderer

```js
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
```

`renderer.render(scene, camera)` 会把当前场景按照相机视角绘制到 Canvas。

### 几何体 Geometry

几何体描述的是顶点数据，例如位置、法线、UV 坐标。

```js
const geometry = new THREE.SphereGeometry(1, 32, 32)
```

常见几何体：

- `BoxGeometry`
- `SphereGeometry`
- `PlaneGeometry`
- `CylinderGeometry`
- `BufferGeometry`

底层看，几何体最终会变成 GPU 可以理解的顶点缓冲区。

### 材质 Material

材质决定物体如何被渲染：

```js
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.4,
  metalness: 0.2,
})
```

常见材质：

| 材质 | 特点 |
| :--- | :--- |
| MeshBasicMaterial | 不受光照影响，性能好 |
| MeshLambertMaterial | 漫反射材质，适合简单光照 |
| MeshPhongMaterial | 支持高光，较传统 |
| MeshStandardMaterial | PBR 材质，更真实，常用 |
| ShaderMaterial | 自定义着色器，灵活度最高 |

### 灯光 Light

如果使用 `MeshStandardMaterial`、`MeshPhongMaterial` 等受光照影响的材质，需要添加灯光：

```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(3, 5, 2)

scene.add(ambientLight)
scene.add(directionalLight)
```

常见灯光：

- `AmbientLight`：环境光，整体提亮。
- `DirectionalLight`：平行光，类似太阳光。
- `PointLight`：点光源，类似灯泡。
- `SpotLight`：聚光灯。

## 加载模型

Web 3D 中推荐使用 `glTF` 或 `GLB`。它们适合传输完整模型、材质、纹理、动画等数据。

```js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const loader = new GLTFLoader()

loader.load('/models/demo.glb', (gltf) => {
  scene.add(gltf.scene)
})
```

如果模型很大，应考虑：

- 压缩模型体积。
- 使用 Draco 或 Meshopt 压缩。
- 优化贴图大小。
- 按需加载模型。
- 控制面数和材质数量。

## 交互：射线检测

鼠标点击 3D 对象时，通常使用 `Raycaster`：

```js
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

window.addEventListener('click', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    console.log('点击对象：', intersects[0].object)
  }
})
```

原理是：从相机位置向鼠标对应的 3D 方向发射一条射线，计算它与哪些物体相交。

## 响应式尺寸

```js
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
})
```

相机宽高比和渲染器尺寸都需要同步更新，否则画面会被拉伸。

## 原理层理解

### 1. Three.js 是 WebGL 的上层封装

浏览器真正负责 GPU 绘制的是 WebGL。Three.js 做的事情包括：

- 管理场景对象。
- 管理相机、矩阵和层级关系。
- 把几何体转换为顶点缓冲区。
- 根据材质生成或使用着色器。
- 管理纹理、灯光、阴影。
- 按帧调用 WebGL API 完成绘制。

### 2. 3D 对象依赖矩阵变换

一个物体的位置、旋转、缩放最终会合成为矩阵：

- 模型矩阵：对象自身变换。
- 视图矩阵：相机视角变换。
- 投影矩阵：把 3D 空间投影到 2D 屏幕。

GPU 渲染顶点时，本质上会把顶点坐标经过这些矩阵一步步变换到屏幕坐标。

### 3. 渲染循环驱动画面

Three.js 动画通常基于 `requestAnimationFrame`：

```js
function animate() {
  requestAnimationFrame(animate)
  update()
  renderer.render(scene, camera)
}
```

每一帧一般分为：

1. 更新状态，例如位置、旋转、动画时间。
2. 更新相机或控制器。
3. 渲染场景。

### 4. 材质背后是着色器

材质最终会转换为 GPU 执行的着色器程序。着色器主要包括：

- 顶点着色器：处理顶点位置。
- 片元着色器：计算每个像素颜色。

普通材质隐藏了着色器细节；`ShaderMaterial` 则允许开发者直接编写 GLSL，实现更自由的水面、粒子、故障风格、扫描线等效果。

### 5. 性能瓶颈通常来自 Draw Call 和资源体积

浏览器 3D 性能常见瓶颈：

- 模型面数过高。
- 材质和纹理数量过多。
- Draw Call 太多。
- 阴影、后处理、透明材质开销大。
- 每帧创建对象，造成 GC 压力。

优化思路：

- 合并几何体或使用实例化渲染。
- 降低模型面数和贴图尺寸。
- 控制灯光和阴影数量。
- 避免在动画循环中频繁 new 对象。
- 大场景按需加载和卸载。

## 与框架结合

在 Vue 或 React 中使用 Three.js 时，建议：

- Canvas 和 Three.js 实例由组件挂载时创建。
- 在组件卸载时释放几何体、材质、纹理和事件监听。
- 不要把每一帧变化都放进响应式状态。
- 框架负责页面结构，Three.js 负责 Canvas 内部渲染。

## 一句话总结

Three.js 的核心是把 WebGL 复杂的底层绘制过程抽象成场景、相机、几何体、材质和动画循环，让浏览器可以更高效地构建 3D 交互体验。
