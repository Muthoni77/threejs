import * as THREE from "three";
import { Scene } from "./scene.js";

export class Scene_2 extends Scene {
  particles;

  constructor(renderer) {
    super(renderer);
    this.particles = this.generateParticles();
    this.scene.add(this.particles);
  }

  generateParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const count = 20000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    // Texture
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(
      "./src/textures/circle.png"
    );
    // Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      // color: 0xaaffaa,
      map: particleTexture,
      transparent: true,
      alphaMap: particleTexture,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    // Points
    return new THREE.Points(particleGeometry, particleMaterial);
  }
  setupCamera() {
    super.setupCamera();
    this.camera.position.z = 2;
    this.camera.lookAt(this.scene.position);
  }

  animate(elapsedTime) {
    super.animate(elapsedTime);
    // Update Particles
    this.particles.rotation.y = Math.sin(elapsedTime * 0.2) * 0.4;
    this.particles.rotation.x = Math.cos(elapsedTime * 0.2) * 0.4;
    this.particles.rotation.z = Math.cos(elapsedTime * 0.2) * 0.4;
  }
}
