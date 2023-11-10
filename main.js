import * as THREE from 'three'
import { gsap } from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

// 버튼 요소 가져오기
const resizeButton = document.getElementById("resize-button");

THREE.ColorManagement.enabled = false
/**
 * Models
 */
const gltfLoader = new GLTFLoader()
let gltf;

gltfLoader.load(
    '/static/models/ummmb/ummmb.gltf',
    (loadedGltf) => {
        // console.log(gltf.scene.children[1])
        gltf = loadedGltf;

        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.children[0].material = bodyMaterial
        gltf.scene.children[1].material = outMaterial
        gltf.scene.children[2].material = inMaterial

        gltf.scene.rotation.x = Math.PI * 0.15
        gltf.scene.rotation.y = Math.PI * 0.25
        scene.add(gltf.scene)

        updateAllMaterials()
        let num = 0;
        // 버튼 클릭 이벤트 처리
        resizeButton.addEventListener("click", () => {
            
            // gsap을 사용하여 크기를 조절
            gsap.to(gltf.scene.scale, {
              x: 1,
              y: 2.6,
              z: 1,
              duration: 0.4, // 애니메이션 지속 시간 (초)
              ease: "elastic.Out", // 애니메이션 이징
              onComplete: () => {
                // 확대 애니메이션이 완료된 후에 작아지는 애니메이션 시작
                gsap.to(gltf.scene.scale, {
                  x: 2, // 작아질 크기 (원래 크기)
                  y: 2,
                  z: 2,
                  duration: .1, // 애니메이션 지속 시간 (1초)
                  ease: "power4.in", // 애니메이션 이징
                });
              },
            });

            const rotationDuration = 1.1; // 회전 애니메이션 지속 시간 (초)
            const rotationCount = 1; // 회전 횟수
          
            // 모델 회전 애니메이션
            gsap.to(gltf.scene.rotation, {
              y: "+=" + Math.PI * 2, // Y 축 주위로 한 번 회전
              duration: rotationDuration,
              repeat: rotationCount - 1, // 초기 회전 포함하여 총 rotationCount - 1번 반복
              ease: "power2.Out"
            });

            outMaterial.color = new THREE.Color(0xffffff);
            // inMaterial.map = outColorTex
            outMaterial.map = chColorTex[num]
            num += 1;
            if(num >= 10){
                num = 1;
            }

            updateAllMaterials(); // 재질 업데이트 함수 호출
        });

    }
)
const textureLoader = new THREE.TextureLoader()

const chColorTex = [
    textureLoader.load('/static/tex/ch/ch-01.jpg'),
    textureLoader.load('/static/tex/ch/ch-02.jpg'),
    textureLoader.load('/static/tex/ch/ch-03.jpg'),
    textureLoader.load('/static/tex/ch/ch-04.jpg'),
    textureLoader.load('/static/tex/ch/ch-05.jpg'),
    textureLoader.load('/static/tex/ch/ch-06.jpg'),
    textureLoader.load('/static/tex/ch/ch-07.jpg'),
    textureLoader.load('/static/tex/ch/ch-08.jpg'),
    textureLoader.load('/static/tex/ch/ch-09.jpg'),
    textureLoader.load('/static/tex/ch/ch-10.jpg'),
]
const outColorTex = textureLoader.load('/static/tex/outside_color.jpg')
const outNormalTex = textureLoader.load('/static/tex/outside_normal_DX.jpg')
const outRoughnessTex = textureLoader.load('/static/tex/outside_roughness.jpg')
const inColorTex = textureLoader.load('/static/tex/inside_color.jpg')
const inNormalTex = textureLoader.load('/static/tex/inside_normal.jpg')
const inRoughnessTex = textureLoader.load('/static/tex/inside_roughness.jpg')

const bodyMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.172,
    roughness: 0.158
})

const outMaterial = new THREE.MeshStandardMaterial({
    map: outColorTex,
    color: 0xffffff,
    transparent: true,
    normalMap: outNormalTex,
    roughnessMap: outRoughnessTex,
    metalness: 0.0893,
    roughness: 0.6915
})
outMaterial.normalScale.set(2, 2);

const inMaterial = new THREE.MeshStandardMaterial({
    map: inColorTex,
    color: 0xffffff,
    transparent: true,
    normalMap: inNormalTex,
    roughnessMap: inRoughnessTex,
    metalness: 0.0893,
    roughness: 0.6915
})


// const cubeTextureLoader = new THREE.CubeTextureLoader()

// LDR cube texture
// const environmentMap = cubeTextureLoader.load([
//     '/static/hdr/px.png',
//     '/static/hdr/nx.png',
//     '/static/hdr/py.png',
//     '/static/hdr/ny.png',
//     '/static/hdr/pz.png',
//     '/static/hdr/nz.png'
// ])

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// const materialFolder = gui.addFolder('Material Settings'); // 재질 설정 폴더 생성

// // 색상을 조절하는 컨트롤을 추가
// const colorControl = materialFolder.addColor(inMaterial, 'color');

// colorControl.onChange((color) => {
//     inMaterial.color.set(color); // 컬러 값 업데이트
// });
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// scene.background = environmentMap
// scene.environment = environmentMap
// scene.background = environmentMap

// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001)
/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = 3
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, .8, 2)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.55, 0)
// controls.enableDamping = true
/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(3, 7, 6)
directionalLight.castShadow = true
scene.add(directionalLight)
// Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(512, 512)

// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
// gui.add(directionalLight.position, 'x').min(- 10).max(10).step(0.001).name('lightX')
// gui.add(directionalLight.position, 'y').min(- 10).max(10).step(0.001).name('lightY')
// gui.add(directionalLight.position, 'z').min(- 10).max(10).step(0.001).name('lightZ')


const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Tone mapping
renderer.toneMapping = THREE.LinearToneMapping
renderer.toneMappingExposure = 1.386
// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// })


// scene.background = new THREE.Color(0xffffff);

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
