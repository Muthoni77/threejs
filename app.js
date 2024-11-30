import "./style.css";
import * as THREE from "three";
import { Scene_1 } from "./src/scene/scene1.js";
import { Scene_2 } from "./src/scene/scene2.js";
import { Scene_3 } from "./src/scene/scene3.js";
import { Scene_4 } from "./src/scene/scene4.js";

document.querySelector("#app").innerHTML = `
  <div>
    <canvas class="webgl"></canvas>
    <!-- horizonatal list of for switching scenes -->
    <div class="scene-switcher">
        <button id="scene1">Scene 1</button>
        <button id="scene2">Scene 2</button>
        <button id="scene3">Scene 3</button>
        <div id="player"></div>
        <button id="scene4">Scene 4</button>
    </div>
    
  </div>
`;

const canvas = document.querySelector("canvas.webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls
let currentScene = null;

function updateScene(scene) {
  if (currentScene) {
    currentScene.finalize();
    console.log("hey, ")
  }
  currentScene = scene;
}

updateScene(new Scene_4(renderer));

// Switch scenes
document.getElementById("scene1").addEventListener("click", () => {
  updateScene(new Scene_1(renderer));
});

document.getElementById("scene2").addEventListener("click", () => {
  updateScene(new Scene_2(renderer));
});

document.getElementById("scene3").addEventListener("click", () => {
  updateScene(new Scene_3(renderer));
});

document.getElementById("scene4").addEventListener("click", () => {
  updateScene(new Scene_4(renderer));
});

// On page resize set new renderer size
window.addEventListener("resize", () => {
  if (!currentScene && !currentScene.getCamera()) return;
  renderer.setSize(window.innerWidth, window.innerHeight);
  currentScene.resize(window.innerWidth, window.innerHeight);
});

// Render Loop
const clock = new THREE.Clock();
function animate() {
  if (!currentScene) return;
  const elapsedTime = clock.getElapsedTime();
  currentScene.animate(elapsedTime);
}

renderer.setAnimationLoop(animate);
