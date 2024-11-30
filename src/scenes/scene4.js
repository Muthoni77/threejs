import * as THREE from "three";

function Scene_4(renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 2;
  camera.lookAt(scene.position);

  // Generate particles
  const particles = generateParticles();
  scene.add(particles);

  function generateParticles() {
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

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load("./src/textures/circle2.png");

    // Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      map: particleTexture,
      transparent: true,
      alphaMap: particleTexture,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    // Create points
    return new THREE.Points(particleGeometry, particleMaterial);
  }

  function animate(elapsedTime) {
    particles.rotation.y = Math.sin(elapsedTime * 0.2) * 0.4;
    particles.rotation.x = Math.cos(elapsedTime * 0.2) * 0.4;
    particles.rotation.z = Math.cos(elapsedTime * 0.2) * 0.4;

    renderer.render(scene, camera);
  }

  function resize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function finalize() {
    // Dispose of particles
    if (particles.geometry) particles.geometry.dispose();
    if (particles.material) particles.material.dispose();

    // Clean up scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    console.log("Scene_2 finalized");
  }

  function getCamera() {
    return camera;
  }

  // Return public API
  return {
    animate,
    resize,
    finalize,
    getCamera,
  };
}

export { Scene_4 };
