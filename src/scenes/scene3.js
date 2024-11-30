
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { Scene } from "./scene.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class Scene_3 extends Scene {
  fontLoader;
  cube;
  controls;
  constructor(renderer) {
    super(renderer);
    this.fontLoader = new FontLoader();
    this.centerFont();
    this.cube = this.Cube3X3();
    this.scene.add(this.cube);
    this.pointLight();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  setupCamera() {
    super.setupCamera();
    this.camera.position.z = 5;
  }

  centerFont() {
    this.fontLoader.load("./SuperCharge.json", (font) => {
      const geometry = new TextGeometry("\\*.*/", {
        font: font,
        size: 0.5,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      const material = new THREE.MeshMatcapMaterial({
        color: 0xdddddd,
      });
      const text = new THREE.Mesh(geometry, material);
      geometry.computeBoundingBox();
      text.position.x = -geometry.boundingBox.max.x / 2;
      text.position.y = -geometry.boundingBox.max.y / 2;
      text.position.z = 0;
      this.scene.add(text);
    });
  }

  Cube3X3() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0000FF,
      metalness: 1,
      roughness: 0.8,
    });
    material.side = THREE.DoubleSide;
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const positions = 3 * 3 * 3;
    const spacing = 1.5;
    for (let i = 0; i < positions; i++) {
      const sphere = new THREE.Mesh(geometry, material);
      const x = spacing * (Math.floor(i / 9) - 1);
      const y = spacing * ((Math.floor(i / 3) % 3) - 1);
      const z = spacing * ((i % 3) - 1);
      if (x === 0 && y === 0 && z === 0) {
        continue;
      }
      console.log(x, y, z);
      sphere.position.x = x;
      sphere.position.y = y;
      sphere.position.z = z;
      group.add(sphere);
    }
    return group;
  }

  pointLight() {
    const pointLight = new THREE.PointLight(0xffffff, 20, 1000, 1);
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 0;
    this.scene.add(pointLight);
  }

  finalize() {
    // Do not dispose renderer here
    // Only remove 1. Scene 2. Camera 3. Objects 4. Materials 5. Textures 6. Renderer Effects
  }

  animate(elapsedTime) {
    super.animate(elapsedTime);
    this.controls.update();
    // Do not call renderer here
    this.cube.rotation.y = Math.sin(elapsedTime * 0.2);
    this.cube.rotation.x = Math.cos(elapsedTime * 0.2);
    this.cube.rotation.z += 0.001;
  }
}