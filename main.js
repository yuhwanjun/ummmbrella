import * as THREE from "three";

import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


let cursorControl = false;

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
      y : 12,
      z : 0,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : 1,
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
      x : -0.95,
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
    // scene num 3
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
  },
  {
    // scene num 4
    camera : {
      x : 0,
      y : 0,
      z : 12,
      duration: 0.5,
      ease : 'power2.inOut'
    },
    modelPosition : {
      x : 0,
      y : -3,
      z : -4,
      duration: 0.5,
      ease : 'power1.inOut'
    },
    modelRotation : {
      x : .2,
      y : Math.PI * 3/4,
      z : -0.8,
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
    this.cursor = {
      x: 0,
      y: 0
    }

    this.matNum = 0;
    for (let i = 0; i < 20; i++) {
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
  changeInTexture(num){
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
    this.materials.inMaterial.map = this.chColorTex[num];
    this.materials.outMaterial.map = this.chColorTex[0];
  }
  changeOutTexture(num){
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
    this.materials.outMaterial.map = this.chColorTex[num];
    this.materials.inMaterial.map = this.chColorTex[0];
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
    // this.composer.render();
    
    if(cursorControl){
      const speedFactor = 1.1;

      this.camera.position.x = Math.sin(this.cursor.x * Math.PI * 2) * 10 * speedFactor;
      this.camera.position.z = Math.cos(this.cursor.x * Math.PI * 2) * 10 * speedFactor;
      this.camera.position.y = this.cursor.y * 8;
      this.camera.lookAt(this.model.position)
    }


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
    const directionalLight = new THREE.DirectionalLight("#eef5ff", 0.4);
    directionalLight.position.set(3, 5, 4);
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
  init(){
    this.handleResize()
    this.setRenderer()
    this.scene.add(this.model);
    
    this.updateAllMaterials();
    this.addLight() 

    this.camera.position.set(sceneControl[0].camera.x,sceneControl[0].camera.y,sceneControl[0].camera.z)
		this.camera.lookAt(this.cameraTarget);

    this.animate();
    
    const patternBtn = document.querySelectorAll(".pattern-btn");
    const viewBtn = document.querySelectorAll(".view-btn");

    patternBtn[0].addEventListener("click", () => this.changeOutTexture(11));
    patternBtn[1].addEventListener("click", () => this.changeOutTexture(9));
    patternBtn[2].addEventListener("click", () => this.changeOutTexture(6));
    // patternBtn[1].addEventListener("click", () => this.changeInTexture(1))

    const inPatternBtn = document.querySelectorAll(".in-pattern-btn");
    const outPatternBtn = document.querySelectorAll(".out-pattern-btn");

    outPatternBtn[0].addEventListener("click", () => this.changeOutTexture(2));
    outPatternBtn[1].addEventListener("click", () => this.changeOutTexture(3));
    outPatternBtn[2].addEventListener("click", () => this.changeOutTexture(4));
    outPatternBtn[3].addEventListener("click", () => this.changeOutTexture(6));
    outPatternBtn[4].addEventListener("click", () => this.changeOutTexture(7));
    outPatternBtn[5].addEventListener("click", () => this.changeOutTexture(8));
    outPatternBtn[6].addEventListener("click", () => this.changeOutTexture(9));
    outPatternBtn[7].addEventListener("click", () => this.changeOutTexture(11));
    outPatternBtn[8].addEventListener("click", () => this.changeOutTexture(19));
    outPatternBtn[9].addEventListener("click", () => this.changeOutTexture(14));

    inPatternBtn[0].addEventListener("click", () => this.changeInTexture(2));
    inPatternBtn[1].addEventListener("click", () => this.changeInTexture(3));
    inPatternBtn[2].addEventListener("click", () => this.changeInTexture(4));
    inPatternBtn[3].addEventListener("click", () => this.changeInTexture(6));
    inPatternBtn[4].addEventListener("click", () => this.changeInTexture(7));
    inPatternBtn[5].addEventListener("click", () => this.changeInTexture(8));
    inPatternBtn[6].addEventListener("click", () => this.changeInTexture(9));
    inPatternBtn[7].addEventListener("click", () => this.changeInTexture(11));
    inPatternBtn[8].addEventListener("click", () => this.changeInTexture(19));
    inPatternBtn[9].addEventListener("click", () => this.changeInTexture(14));


    viewBtn[0].addEventListener("click", () => {
      this.moveCamera(0,5,5,0.3,"power1.inOut")
      this.moveModel(1,-0.7,0,0.3,"power1.inOut")
      this.rotateModel(0,0,0,0.3,"power1.inOut")
      this.moveCameraTarget(0,0,0,0.3,"power1.inOut")
    });
    viewBtn[1].addEventListener("click", () => {
      this.moveCamera(0,0,8,0.3,"power1.inOut")
      this.moveModel(1,-0.4,0,0.3,"power1.inOut")
      this.rotateModel(0,Math.PI/2,0,0.3,"power1.inOut")
      this.moveCameraTarget(0,0,0,0.3,"power1.inOut")
    });
    viewBtn[2].addEventListener("click", () => {
      this.moveCamera(0,0,8,0.3,"power1.inOut")
      this.moveModel(1,-0.4,0,0.3,"power1.inOut")
      this.rotateModel(0,Math.PI/2,-Math.PI*1/4,0.3,"power1.inOut")
      this.moveCameraTarget(0,0,0,0.3,"power1.inOut")
    });
    // viewBtn[1].addEventListener("click", () => this.changeOutTexture(9));
    // viewBtn[2].addEventListener("click", () => this.changeOutTexture(6));


    window.addEventListener('mousemove', (event) =>
    {
      this.cursor.x = event.clientX / this.sizes.width - 0.5
      this.cursor.y = event.clientY / this.sizes.height - 0.5
    
      // console.log(this.cursor.x, this.cursor.y)
    })

    window.addEventListener("resize", () => this.handleResize());
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
			
      cursorControl = false;
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
      cursorControl = false;
			break;
		case 2:
			console.log('sceneNum 2');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			
      cursorControl = false;
      // myScene.moveCamera(1,0,1, 0.5,'power2.inOut');
			break;
		case 3:
			console.log('sceneNum 3');
      myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
      myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
      myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
      myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
			
      cursorControl = false;
      // myScene.moveCamera(-1,0,1, 0.5,'power2.inOut');
			break;
    case 4:
        console.log('sceneNum 4');
        myScene.moveCamera(sceneControl[sceneNum].camera.x,sceneControl[sceneNum].camera.y,sceneControl[sceneNum].camera.z, sceneControl[sceneNum].camera.duration,sceneControl[sceneNum].camera.ease);
        myScene.moveModel(sceneControl[sceneNum].modelPosition.x,sceneControl[sceneNum].modelPosition.y,sceneControl[sceneNum].modelPosition.z, sceneControl[sceneNum].modelPosition.duration,sceneControl[sceneNum].modelPosition.ease);
        myScene.rotateModel(sceneControl[sceneNum].modelRotation.x,sceneControl[sceneNum].modelRotation.y,sceneControl[sceneNum].modelRotation.z, sceneControl[sceneNum].modelRotation.duration,sceneControl[sceneNum].modelRotation.ease);
        myScene.moveCameraTarget(sceneControl[sceneNum].TargetPosition.x,sceneControl[sceneNum].TargetPosition.y,sceneControl[sceneNum].TargetPosition.z, sceneControl[sceneNum].TargetPosition.duration,sceneControl[sceneNum].TargetPosition.ease);
        
        cursorControl = true;
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