import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

const resizeButton = document.getElementById("resize-button");
// Canvas
const canvas = document.querySelector("canvas.webgl");

const textureLoader = new THREE.TextureLoader();

const outColorTex = textureLoader.load("/static/tex/outside_color.jpg");
const outNormalTex = textureLoader.load("/static/tex/outside_normal_DX.jpg");
const outRoughnessTex = textureLoader.load("/static/tex/outside_roughness.jpg");
const inColorTex = textureLoader.load("/static/tex/inside_color.jpg");
const inNormalTex = textureLoader.load("/static/tex/inside_normal.jpg");
const inRoughnessTex = textureLoader.load("/static/tex/inside_roughness.jpg");

// import gltf
class Model {
  constructor() {
    this.model = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();
    this.chColorTex = [];
    this.matNum = 0;
    for (let i = 0; i < 11; i++) {
      this.chColorTex.push(textureLoader.load(`/static/tex/ch/ch-${i}.jpg`));
    }

    this.materials = {
      bodyMaterial: new THREE.MeshStandardMaterial({
        metalness: 0.172,
        roughness: 0.158,
      }),
      outMaterial: new THREE.MeshStandardMaterial({
        map: outColorTex,
        color: 0xffffff,
        transparent: true,
        normalMap: outNormalTex,
        roughnessMap: outRoughnessTex,
        metalness: 0.0893,
        roughness: 0.6915,
      }),
      inMaterial: new THREE.MeshStandardMaterial({
        map: inColorTex,
        color: 0xffffff,
        transparent: true,
        normalMap: inNormalTex,
        roughnessMap: inRoughnessTex,
        metalness: 0.0893,
        roughness: 0.6915,
      }),
    };
  }
  loadModel() {
    return new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        "/static/models/ummmb/ummmb.gltf",
        (gltf) => {
          this.model = gltf.scene;
          this.init();
          resolve();
        },
        undefined,
        reject
      );
    });
  }
  addModel(_targetScene) {
    _targetScene.add(this.model);
  }
  init() {
    this.model.scale.set(2, 2, 2);
    this.model.children[0].material = this.materials.bodyMaterial;
    this.model.children[1].material = this.materials.outMaterial;
    this.model.children[2].material = this.materials.inMaterial;

    this.rotate(-.3,0,-.4);
    this.position(-0.1,0.2,0.2);

    resizeButton.addEventListener("click", () => this.changeTexture());
  }
  changeTexture() {
    gsap.to(this.model.scale, {
      x: 1,
      y: 2.6,
      z: 1,
      duration: 0.4, // 애니메이션 지속 시간 (초)
      ease: "elastic.Out", // 애니메이션 이징
      onComplete: () => {
        // 확대 애니메이션이 완료된 후에 작아지는 애니메이션 시작
        gsap.to(this.model.scale, {
          x: 2, // 작아질 크기 (원래 크기)
          y: 2,
          z: 2,
          duration: 0.1, // 애니메이션 지속 시간 (1초)
          ease: "power4.in", // 애니메이션 이징
        });
      },
    });

    const rotationDuration = 1.1;
    const rotationCount = 1;

    gsap.to(this.model.rotation, {
      y: "+=" + Math.PI * 2, // Y 축 주위로 한 번 회전
      duration: rotationDuration,
      repeat: rotationCount - 1, // 초기 회전 포함하여 총 rotationCount - 1번 반복
      ease: "power2.Out",
    });

    this.materials.outMaterial.color = new THREE.Color(0xffffff);
    // inMaterial.map = outColorTex
    this.materials.outMaterial.map = this.chColorTex[this.matNum];
    this.matNum += 1;
    if (this.matNum >= 10) {
      this.matNum = 1;
    }

    this.updateAllMaterials(); // 재질 업데이트 함수 호출
  }
  updateAllMaterials() {
    this.model.traverse((child) => {
      if (child.isMesh && child.material.isMeshStandardMaterial) {
        child.material.envMapIntensity = 3;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
  rotate(_x, _y, _z){
    this.model.rotation.x = _x;
    this.model.rotation.y = _y;
    this.model.rotation.z = _z;
  }
  position(_x, _y, _z){
    this.model.position.x = _x;
    this.model.position.y = _y;
    this.model.position.z = _z;
  }
}

// three scene
class ThreeScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.clock = new THREE.Clock();
    this.model = new Model();
    this.composer = new EffectComposer(this.renderer);

    this.init();
  }
  async importModel() {
    await this.model.loadModel();
    this.model.addModel(this.scene);
    // this.model.rotate(-.4,0,-0.5);
  }
  init() {
    this.animate();
    this.handleResize();

    this.setRenderer();
    this.importModel();
    this.addLight();

    window.addEventListener("resize", () => this.handleResize());
  }
  setRenderer() {
    THREE.ColorManagement.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Tone mapping
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.386;
  }
  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime(); // Clock 인스턴스를 통해 경과된 시간을 가져옴
    const rotationSpeed = 0.001;
    // this.scene.children.forEach((object) => {
    //   if (object instanceof THREE.Mesh) {
    //     object.rotation.x += rotationSpeed * elapsedTime;
    //     object.rotation.y += rotationSpeed * elapsedTime;
    //   }
    // });

    this.renderer.render(this.scene, this.camera);
  }
  handleResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  addLight() {
    const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
    directionalLight.position.set(3, 7, 6);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Target
    directionalLight.target.position.set(0, 4, 0);
    directionalLight.target.updateWorldMatrix();
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(512, 512);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);
  }
  moveCamera(_x, _y, _z){
    this.camera.position.x = _x;
    this.camera.position.y = _y;
    this.camera.position.z = _z;
    this.camera.lookAt(0.1,0.7,0.2)
  }
}

const myScene = new ThreeScene();
myScene.moveCamera(0.2,.8,3);