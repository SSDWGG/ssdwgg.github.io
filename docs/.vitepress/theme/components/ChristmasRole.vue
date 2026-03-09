<!-- eslint-disable ts/ban-ts-comment -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'

// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BufferAttribute } from 'three'

// 创建一个引用，用于挂载Three.js场景
const containerRef = ref<HTMLDivElement | null>(null)

// 定义变量
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let renderer: THREE.WebGLRenderer | undefined
let control: OrbitControls | undefined
let clock: THREE.Clock | undefined
let mixer: THREE.AnimationMixer | undefined
let particlesGeometry: THREE.BufferGeometry | undefined
const particleCount = 2000
let listener: THREE.AudioListener | undefined
let sound: THREE.PositionalAudio | undefined

// 创建一个初始化函数
const initScene = () => {
  if (!containerRef.value)
    return

  // 创建一个场景
  scene = new THREE.Scene()

  // 创建一个相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 500)

  // 创建一个渲染器
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  // 控制器
  if (renderer.domElement) {
    control = new OrbitControls(camera, renderer.domElement)
    control.enableZoom = false
  }

  // 人物动画定时器
  clock = new THREE.Clock()

  // 1、创造粒子缓冲区几何体
  particlesGeometry = new THREE.BufferGeometry()

  // 创建音频监听器
  listener = new THREE.AudioListener()
  camera.add(listener)

  // 创建音频对象
  sound = new THREE.PositionalAudio(listener)

  // 设置相机位置
  camera.position.set(0, 20, 90)
  camera.lookAt(scene.position)

  // 设置渲染器参数
  if (renderer) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(
      containerRef.value.clientWidth,
      containerRef.value.clientHeight,
    )
    const pixelRatio = Math.min(renderer.getPixelRatio(), 2)
    renderer.setPixelRatio(pixelRatio)

    // 将渲染器添加到指定容器中，而不是document.body
    containerRef.value.appendChild(renderer.domElement)
  }

  // 其他初始化函数
  createSpotLight()
  createAmbientLight()
  createDicLight()
  createPointLight()
  loadSnowfield()
  loadTreeModel()
  loadShopModel()
  loadGirlModel()
  const pointMesh = createSnow()
  if (scene && pointMesh) {
    scene.add(pointMesh)
  }
  if (scene) {
    addTwinklingLights(scene)
  }
  createAudio()

  // 开始渲染
  if (renderer) {
    renderer.setAnimationLoop(animate)
  }
}

// 设置聚光灯
function createSpotLight() {
  if (!scene)
    return
  const spotLight = new THREE.SpotLight(0xFFFF00, 1, 100) as any
  spotLight.position.set(0, 0, 0)
  spotLight.isSpotLightShadow = true
  spotLight.castShadow = true
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 1000
  scene.add(spotLight)
  return spotLight
}

// 设置环境光
function createAmbientLight() {
  if (!scene)
    return
  const ambientlight = new THREE.AmbientLight(0xFFFFFF, 1)
  scene.add(ambientlight)
  return ambientlight
}

// 设置平行光
function createDicLight() {
  if (!scene)
    return
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7)
  directionalLight.position.set(100, 20, 20)
  directionalLight.castShadow = true
  directionalLight.shadow.radius = 1000
  if (directionalLight.shadow.mapSize) {
    directionalLight.shadow.mapSize.set(4096, 4096)
  }
  scene.add(directionalLight)
  return directionalLight
}

// 设置点光源
function createPointLight() {
  if (!scene)
    return
  const light = new THREE.PointLight(0xFF00FF, 10, 100)
  light.position.set(50, 120, 50)
  scene.add(light)
  return light
}

// 加载树模型
function loadTreeModel() {
  if (!scene)
    return
  const loader = new GLTFLoader()
  loader.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/models/tree3/scene.gltf', (gltf: any) => {
    gltf.scene.scale.set(4, 4, 4)
    gltf.scene.position.set(-30, -1.2, 0)
    gltf.scene.castShadow = true
    scene?.add(gltf.scene)
  })
}

// 加载商店模型
function loadShopModel() {
  if (!scene || !sound)
    return
  const loader = new GLTFLoader()
  loader.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/models/shop/scene.gltf', (gltf: any) => {
    const modal = gltf.scene
    gltf.scene.scale.set(15, 15, 15)
    gltf.scene.position.set(40, 0, 0)
    gltf.scene.castShadow = true
    scene?.add(gltf.scene)
    modal.add(sound)
  })
}

// 创建雪花
function createSnow() {
  if (!particlesGeometry)
    return
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = Math.random() * 200 - 100
    positions[i3 + 1] = Math.random() * 200
    positions[i3 + 2] = Math.random() * 200 - 100

    velocities[i3] = 0
    velocities[i3 + 1] = -(Math.random() * 0.1 + 0.1)
    velocities[i3 + 2] = 0
  }

  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('velocity', new BufferAttribute(velocities, 3))

  const textureLoader = new THREE.TextureLoader()
  let texture: THREE.Texture | THREE.CanvasTexture
  try {
    texture = textureLoader.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/public/sprite/snow2.png')
  }
  catch (e) {
    console.warn('Failed to load snow texture, creating fallback')
    texture = createCircleTexture()
  }

  const pointsMaterial = new THREE.PointsMaterial({
    size: 1,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    map: texture,
    alphaTest: 0.5,
    opacity: 0.8,
  })

  const pointMesh = new THREE.Points(particlesGeometry, pointsMaterial)
  return pointMesh
}

// 创建圆形纹理
function createCircleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not get 2d context from canvas')
  }

  context.fillStyle = 'white'
  context.beginPath()
  context.arc(32, 32, 30, 0, Math.PI * 2)
  context.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  return texture
}

// 更新雪花
function updateSnow() {
  if (!particlesGeometry)
    return
  const positions = particlesGeometry.attributes.position.array
  const velocities = particlesGeometry.attributes.velocity.array
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i + 1] += velocities[i + 1]

    if (positions[i + 1] < -10) {
      positions[i + 1] = 200
      positions[i] = Math.random() * 200 - 100
      positions[i + 2] = Math.random() * 200 - 100
    }
  }
  particlesGeometry.attributes.position.needsUpdate = true
}

// 加载雪地
function loadSnowfield() {
  if (!scene)
    return
  const plane = new THREE.PlaneGeometry(200, 200)
  const snowTexture = new THREE.TextureLoader()

  let snowDisplacementMap: THREE.Texture | THREE.Color
  try {
    snowDisplacementMap = snowTexture.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/public/texture/Snow2/snow_02_diff_4k.jpg')
  }
  catch (e) {
    console.warn('Failed to load snow texture, using basic material')
    snowDisplacementMap = new THREE.Color(0xFFFFFF)
  }

  let snowNormalMap: THREE.Texture | null = null
  try {
    snowNormalMap = snowTexture.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/public/texture/Snow2/snow_02_nor_gl_4k.jpg')
  }
  catch (e) {
    snowNormalMap = null
  }

  let snowRoughnessMap: THREE.Texture | null = null
  try {
    snowRoughnessMap = snowTexture.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/public/texture/Snow2/snow_02_rough_4k.jpg')
  }
  catch (e) {
    snowRoughnessMap = null
  }

  const planeMaterial = new THREE.MeshStandardMaterial({
    map: snowDisplacementMap instanceof THREE.Color ? null : snowDisplacementMap,
    color: snowDisplacementMap instanceof THREE.Color ? snowDisplacementMap : 0xFFFFFF,
    normalMap: snowNormalMap,
    roughnessMap: snowRoughnessMap,
    side: THREE.DoubleSide,
  })
  const planeMesh = new THREE.Mesh(plane, planeMaterial)
  planeMesh.position.set(0, -1, 0)
  planeMesh.rotation.x = (-Math.PI / 2)
  planeMesh.receiveShadow = true
  scene.add(planeMesh)
}

// 添加闪烁灯光
function addTwinklingLights(scene: THREE.Scene) {
  const particleCount = 150
  const positions = new Float32Array((particleCount + 1) * 3)
  const colors = new Float32Array((particleCount + 1) * 3)

  positions[0] = 10
  positions[1] = 50
  positions[2] = 50

  colors[0] = 1
  colors[1] = 1
  colors[2] = 1

  const color = new THREE.Color()

  for (let i = 0; i < particleCount; i++) {
    const i3 = (i + 1) * 3
    const angle = i * 0.2
    const radius = 8
    const heightStep = 0.15

    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle)
    const y = i * heightStep

    positions[i3] = x
    positions[i3 + 1] = y
    positions[i3 + 2] = z

    color.setHSL(Math.random() * 0.25 + 0.5, 1.0, 0.6)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  const particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new BufferAttribute(colors, 3))

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    depthTest: true,
  })

  const particles = new THREE.Points(particleGeometry, particleMaterial)
  particles.position.set(-30, 0, 0)
  scene.add(particles)

  function animateLights() {
    const time = Date.now() * 0.005
    const opacity = (Math.sin(time) + 1) / 2 * 0.7 + 0.7

    particleMaterial.opacity = opacity
    requestAnimationFrame(animateLights)
  }
  animateLights()
}

// 加载女孩模型
function loadGirlModel() {
  if (!scene)
    return
  const loader = new GLTFLoader()
  let model: THREE.Group | null = null
  loader.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/models/gltf/winterfest_bushranger_fortnite_skin.glb', (gltf: any) => {
    model = gltf.scene
    const spotLight = createSpotLight()
    if (spotLight && model) {
      spotLight.target = model
    }
    if (model && model.children && model.children[0] && model.children[0].children && model.children[0].children[0]) {
      model.children[0].children[0].castShadow = true
    }
    model?.scale.set(20, 20, 20)
    model?.position.set(0, 0, 20)
    if (model) {
      mixer = new THREE.AnimationMixer(model)
      if (gltf.animations && gltf.animations.length > 0) {
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
      }
    }
    scene?.add(model as any)
  })
}

// 动画循环
function animate() {
  if (!clock || !renderer || !scene || !camera)
    return
  const delta = clock.getDelta()
  if (mixer) {
    mixer.update(delta)
  }
  if (control) {
    control.update()
  }
  updateSnow()
  renderer.render(scene, camera)
}

// 创建音频
function createAudio() {
  if (!sound)
    return
  const audioLoader = new THREE.AudioLoader()
  audioLoader.load('https://icon-erp.oss-cn-hangzhou.aliyuncs.com/sPageChristmas/public/music/ddd.ogg', (buffer) => {
    sound?.setBuffer(buffer)
    sound?.setLoop(true)
    sound?.setRefDistance(20)
    sound?.setVolume(0.5)
    sound?.play()
  }, (xhr) => {
    console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`)
  }, (error) => {
    console.error('Error loading audio:', error)
  })
}

// 清理音频资源
function disposeAudio() {
  if (sound) {
    // 停止播放音频
    if (sound.isPlaying) {
      sound.stop()
    }
    // 移除音频源
    sound.disconnect()
    sound = undefined
  }
  if (listener) {
    // 从相机中移除监听器
    if (camera && listener.parent === camera) {
      camera.remove(listener)
    }
    listener = undefined
  }
}

// 在组件挂载时初始化场景
onMounted(() => {
  initScene()

  // 监听窗口大小变化
  const handleResize = () => {
    if (containerRef.value && camera && renderer) {
      camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    }
  }

  window.addEventListener('resize', handleResize)

  // 组件卸载时清理资源
  return () => {
    window.removeEventListener('resize', handleResize)
    if (renderer) {
      renderer.setAnimationLoop(null)
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }

    // 清理音频资源
    disposeAudio()

    // 清理其他Three.js资源
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose()
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose())
            }
            else {
              child.material.dispose()
            }
          }
        }
      })
    }

    // 销毁控制器
    if (control) {
      control.dispose()
    }

    // 销毁时钟
    clock = undefined

    // 销毁混合器
    if (mixer) {
      mixer.stopAllAction()
      mixer = undefined
    }

    // 销毁粒子几何体
    if (particlesGeometry) {
      particlesGeometry.dispose()
      particlesGeometry = undefined
    }

    // 销毁场景相关对象
    scene = undefined
    camera = undefined
    renderer = undefined
  }
})
</script>

<template>
  <div ref="containerRef" style="width: 100%; height: 100vh;" />
</template>
