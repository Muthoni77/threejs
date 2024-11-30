

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getStarfield from "../getStarField.js";
import { getFresnelMat } from "../getFresnel.js";

function Scene_1(renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Set renderer properties
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  // Group for Earth-related objects
  const earthGroup = new THREE.Group();
  earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
  scene.add(earthGroup);

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Loaders and materials
  const detail = 12;
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.IcosahedronGeometry(1, detail);

  const material = new THREE.MeshPhongMaterial({
    map: loader.load("./src/textures/00_earthmap1k.jpg"),
    specularMap: loader.load("./src/textures/02_earthspec1k.jpg"),
    bumpMap: loader.load("./src/textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
  });

  const earthMesh = new THREE.Mesh(geometry, material);
  earthGroup.add(earthMesh);

  const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./src/textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMat);
  earthGroup.add(lightsMesh);

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./src/textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("./src/textures/05_earthcloudmaptrans.jpg"),
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  earthGroup.add(cloudsMesh);

  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  earthGroup.add(glowMesh);

  const stars = getStarfield({ numStars: 2000 });
  scene.add(stars);

  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(-2, 0.5, 1.5);
  scene.add(sunLight);

  // Lifecycle methods
  function animate(elapsedTime) {
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;

    controls.update();
    renderer.render(scene, camera);
  }

  function resize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function finalize() {
    controls.dispose();

    // Dispose resources
    while (scene.children.length > 0) {
      const child = scene.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
      scene.remove(child);
    }
    console.log("Scene_1 finalized");
  }

  function getCamera() {
    return camera;
  }

  // Public API
  return {
    animate,
    resize,
    finalize,
    getCamera,
  };
}

export { Scene_1 };
