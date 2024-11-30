import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { OutputPass } from "three/examples/jsm/Addons.js";

export class Scene {
  camera;
  renderer;
  scene;
  composer;

  isOutPutPassSet = false;

  constructor(renderer) {
    // type guard for renderer
    if (!(renderer instanceof THREE.WebGLRenderer)) {
      throw new Error(
        "Scene constructor expects a THREE.WebGLRenderer as an argument"
      );
    }
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.setupCamera();
    this.setupRenderer();
  }

  setupCamera() {
    //
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    //
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // composer
    const target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        samples: 8,
      }
    );
    this.renderer.toneMappingExposure = 1;
    this.composer = new EffectComposer(this.renderer, target);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  }

  getCamera() {
    //
    return this.camera;
  }

  getScene() {
    //
    return this.scene;
  }

  finalize() {
    //
  }

  setOutputPass() {
    this.addPass(new OutputPass());
  }

  animate(elapsedTime) {
    // if(this.isOutPutPassSet){
    //     this.setOutputPass()
    // }
    this.composer.render();
  }

  addPass(pass) {
    //
    if (pass instanceof OutputPass && this.isOutPutPassSet) {
      throw new Error("OutputPass already set");
    }
    if (pass instanceof OutputPass) {
      this.isOutPutPassSet = true;
    }
    this.composer.addPass(pass);
  }

  resize(width, height) {
    // type guard for width and height as numbers
    if (typeof width !== "number" || typeof height !== "number") {
      throw new Error("Scene.resize expects width and height as numbers");
    }
    this.getCamera().aspect = width / height;
    this.getCamera().updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }
}
