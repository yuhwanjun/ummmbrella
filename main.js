import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


const resizeButton = document.getElementById("resize-button");
const textureLoader = new THREE.TextureLoader();

const sceneControl = [
  {
    // scene num 0
    camera : {
      x : 0,
      y : 0.6,
      z : 4.6,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : -0.2,
      y : -0.2,
      z : 0.2,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelRotation : {
      x : -0.4,
      y : 3,
      z : 0.5,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    TargetPosition : {
      x : 0,
      y : 0.5,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    }
  },
  {
    // scene num 1
    camera : {
      x : 0,
      y : 10,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : 0.75,
      y : 0,
      z : 0,
      duration: 0.5,
      ease : 'power1.inOut'
    },
    modelRotation : {
      x : 0,
      y : Math.PI,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    TargetPosition : {
      x : 0,
      y : 0,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    }
  },
  {
    // scene num 2
    camera : {
      x : 0,
      y : 0,
      z : 11,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : -0.85,
      y : -0.4,
      z : 0,
      duration: 0.5,
      ease : 'power1.inOut'
    },
    modelRotation : {
      x : 0,
      y : Math.PI * 3/4,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    TargetPosition : {
      x : 0,
      y : 0,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    }
  },
  {
    // scene num 2
    camera : {
      x : 0,
      y : 0,
      z : 8,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : 0.75,
      y : -0.4,
      z : -.1,
      duration: 0.5,
      ease : 'power1.inOut'
    },
    modelRotation : {
      x : .8,
      y : Math.PI * 3/4,
      z : -0.4,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    TargetPosition : {
      x : 0,
      y : 0,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    }
  }
]

class ThreeScene {
  constructor(){
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera = new THREE.PerspectiveCamera(
      15, this.sizes.width / this.sizes.height, 0.1, 1000
    );
    this.cameraTarget = new THREE.Vector3(sceneControl[0].TargetPosition.x,sceneControl[0].TargetPosition.y,sceneControl[0].TargetPosition.z);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas.webgl"),
      antialias: true,
      alpha: true,
    });
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.model = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();
    this.chColorTex = [];

    this.matNum = 0;
    for (let i = 0; i < 11; i++) {
      this.chColorTex.push(this.textureLoader.load(`/static/tex/ch/ch-${i}.jpg`, (texture) => {
        texture.flipY = false; // Y 축 뒤집기 비활성화
      }));
    }

    this.materials = {
      bodyMaterial: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.272,
        roughness: 0.558,
      }),
      outMaterial: new THREE.MeshStandardMaterial({
        map: this.chColorTex[0],
        color: 0xffffff,
        transparent: true,
        normalMap: this.textureLoader.load("/static/tex/outside_normal_DX.jpg"),
        roughnessMap: this.textureLoader.load("/static/tex/outside_roughness.jpg"),
        metalness: 0.0893,
        roughness: 0.5915,
      }),
      inMaterial: new THREE.MeshStandardMaterial({
        map: this.chColorTex[4],
        color: 0xffffff,
        transparent: true,
        normalMap: this.textureLoader.load("/static/tex/inside_normal.jpg"),
        roughnessMap: this.textureLoader.load("/static/tex/inside_roughness.jpg"),
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

          this.model.scale.set(2, 2, 2);
          this.model.position.set(sceneControl[0].modelPosition.x, sceneControl[0].modelPosition.y,sceneControl[0].modelPosition.z);
          this.model.rotation.set(sceneControl[0].modelRotation.x, sceneControl[0].modelRotation.y, sceneControl[0].modelRotation.z);

          this.model.children[0].material = this.materials.bodyMaterial;
          this.model.children[1].material = this.materials.outMaterial;
          this.model.children[2].material = this.materials.inMaterial;
          this.init();
          resolve();
        },
        undefined,
        reject
      );
    });
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
  handleResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  animate() {
    this.renderer.render(this.scene, this.camera);
    
    requestAnimationFrame(() => this.animate());
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
  addLight() {
    const directionalLight = new THREE.DirectionalLight("#ffffff", 0.4);
    directionalLight.position.set(3, 7, 6);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Target
    directionalLight.target.position.set(sceneControl[0].modelPosition.x, sceneControl[0].modelPosition.y, sceneControl[0].modelPosition.z);
    directionalLight.target.updateWorldMatrix();
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(512, 512);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
  }
  init(){
    this.handleResize()
    this.setRenderer()
    this.scene.add(this.model);

    this.updateAllMaterials();
    this.addLight() 
    // this.addCube()
    // this.importModel()

    this.camera.position.set(sceneControl[0].camera.x,sceneControl[0].camera.y,sceneControl[0].camera.z)
		this.camera.lookAt(this.cameraTarget);

    this.animate();
    
    window.addEventListener("resize", () => this.handleResize());
  }
  moveCamera(_x, _y, _z, _duration, _ease){
    gsap.to(this.camera.position, {
				x: _x,
				y: _y,
				z: _z,
        duration: _duration,
				ease: _ease
      }
    )
  }
  moveModel(_x, _y, _z, _duration, _ease){
    gsap.to(this.model.position, {
				x: _x,
				y: _y,
				z: _z,
        duration: _duration,
				ease: _ease
      }
    )
  }
  rotateModel(_x, _y, _z, _duration, _ease){
    gsap.to(this.model.rotation, {
				x: _x,
				y: _y,
				z: _z,
        duration: _duration,
				ease: _ease
      }
    )
  }
  moveCameraTarget(_x, _y, _z, _duration, _ease) {
    gsap.to({}, {
      duration: _duration,
      ease: _ease,
      onUpdate: () => {
        this.cameraTarget.set(_x, _y, _z);
        this.camera.lookAt(this.cameraTarget);
      },
    });
  }
}

const myScene = new ThreeScene();

myScene.init();
myScene.loadModel();
console.log(myScene)

/* scene setting */
function sceneMove(sceneNum) {
	switch (sceneNum) {
		case 0:
			console.log('sceneNum 0');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			break;
		case 1:
			console.log('sceneNum 1');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			
      // myScene.moveCamera(-1,0,1, 0.5,'power2.inOut');
      // myScene.moveModel( 0,0,-2, 0.5,'power2.inOut');
      // myScene.moveCameraTarget( 0,0,-2, 0.5,'power2.inOut');
			break;
		case 2:
			console.log('sceneNum 2');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			
      // myScene.moveCamera(1,0,1, 0.5,'power2.inOut');
			break;
		case 3:
			console.log('sceneNum 3');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			
      // myScene.moveCamera(-1,0,1, 0.5,'power2.inOut');
			break;
		default:
			console.log(`Sorry, we are out of ${sceneNum}.`);
	}
}

/* Sizes */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
// scroll
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)

  if (newSection !== currentSection) {
    currentSection = newSection;
    sceneMove(currentSection);
  }
});