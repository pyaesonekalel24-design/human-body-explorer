
import * as THREE from "three";

const container = document.getElementById("game");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const hud = document.getElementById("hud");
const locationDisplay = document.getElementById("location");
const messageDisplay = document.getElementById("message");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x170c16);
scene.fog = new THREE.Fog(0x170c16, 12, 65);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

camera.position.set(0, 1.7, 8);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffc6d5, 0x321b35, 2));

const mainLight = new THREE.PointLight(0xffb0c4, 90, 45);
mainLight.position.set(0, 8, -12);
scene.add(mainLight);

const stomachLight = new THREE.PointLight(0xff8b69, 100, 35);
stomachLight.position.set(0, 6, -30);
scene.add(stomachLight);

const materials = {
  tissue: new THREE.MeshStandardMaterial({
    color: 0x9d435c,
    roughness: 0.85,
    side: THREE.DoubleSide
  }),
  darkTissue: new THREE.MeshStandardMaterial({
    color: 0x552238,
    roughness: 0.9,
    side: THREE.DoubleSide
  }),
  floor: new THREE.MeshStandardMaterial({
    color: 0x71364b,
    roughness: 0.95
  }),
  organ: new THREE.MeshStandardMaterial({
    color: 0xb83f55,
    roughness: 0.7
  }),
  heart: new THREE.MeshStandardMaterial({
    color: 0xc92e48,
    roughness: 0.55
  }),
  lung: new THREE.MeshStandardMaterial({
    color: 0x9e526d,
    roughness: 0.8
  }),
  gold: new THREE.MeshStandardMaterial({
    color: 0xe5a36f,
    roughness: 0.6
  })
};

function addBox(x, y, z, width, height, depth, material) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );

  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

function addSphere(x, y, z, sx, sy, sz, material) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 24),
    material
  );

  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  scene.add(mesh);
  return mesh;
}

function addSign(text, x, y, z) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  context.fillStyle = "#29121f";
  context.fillRect(0, 0, 512, 128);

  context.strokeStyle = "#e88ba7";
  context.lineWidth = 5;
  context.strokeRect(4, 4, 504, 120);

  context.fillStyle = "#ffffff";
  context.font = "bold 42px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 1),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  );

  sign.position.set(x, y, z);
  scene.add(sign);
  return sign;
}

function buildEntrance() {
  addSphere(
    0, 3.5, -2,
    4.5, 4.5, 3.5,
    new THREE.MeshStandardMaterial({
      color: 0x9c4058,
      transparent: true,
      opacity: 0.16,
      roughness: 1,
      depthWrite: false
    })
  );

  addSphere(
    0, 2.8, 1.1,
    1.5, 0.55, 0.25,
    materials.darkTissue
  );

  addSphere(
    0, 3.35, 1.1,
    1.6, 0.25, 0.3,
    materials.tissue
  );

  addBox(0, -0.15, -8, 5, 0.3, 19, materials.floor);
  addBox(0, 5.2, -8, 5, 0.3, 19, materials.tissue);

  addBox(-2.6, 2.5, -8, 0.3, 5, 19, materials.tissue);
  addBox(2.6, 2.5, -8, 0.3, 5, 19, materials.tissue);

  addSphere(0, 4.4, -7, 0.65, 0.5, 0.65, materials.darkTissue);
  addSphere(0, 4.2, -12, 0.45, 0.35, 0.45, materials.darkTissue);

  addSign("THROAT", 0, 3.8, -4);
}

function buildStomach() {
  addBox(0, -0.15, -29, 16, 0.3, 23, materials.floor);
  addBox(0, 8.5, -29, 16, 0.3, 23, materials.tissue);

  addBox(-8.1, 4, -29, 0.3, 8, 23, materials.tissue);
  addBox(8.1, 4, -29, 0.3, 8, 23, materials.tissue);

  addSphere(
    -2, 2.5, -29,
    2.2, 1.8, 3,
    materials.organ
  );

  addSphere(
    2.1, 2.2, -31,
    2.1, 1.5, 2.5,
    materials.darkTissue
  );

  addSphere(
    0, 3.1, -37,
    2.8, 1.1, 1.8,
    materials.organ
  );

  addSign("STOMACH CHAMBER", 0, 6.5, -20);
}

function buildOrgans() {
  addSphere(
    -3.1, 5, -26,
    1.1, 1.8, 0.8,
    materials.lung
  );

  addSphere(
    -1.1, 5, -26,
    1.1, 1.8, 0.8,
    materials.lung
  );

  addSphere(
    0, 3.7, -26,
    0.85, 1.05, 0.75,
    materials.heart
  );

  addSphere(
    4.2, 3.2, -25,
    2.1, 1.1, 1.5,
    materials.gold
  );

  const vessel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 3, 16),
    materials.heart
  );

  vessel.position.set(0, 6.3, -26);
  scene.add(vessel);

  addSign("LUNGS", -2.1, 7.2, -25);
  addSign("HEART", 1.5, 5.7, -25);
  addSign("LIVER", 4.2, 5.2, -24);
}

function buildDetails() {
  for (let i = 0; i < 35; i++) {
    const x = (Math.random() - 0.5) * 13;
    const y = 1 + Math.random() * 5;
    const z = -18 - Math.random() * 21;

    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      new THREE.MeshBasicMaterial({
        color: 0xffb5c8
      })
    );

    particle.position.set(x, y, z);
    scene.add(particle);
  }
}

buildEntrance();
buildStomach();
buildOrgans();
buildDetails();

let started = false;
let pointerLocked = false;

const keys = new Set();

let yaw = 0;
let pitch = 0;

const moveSpeed = 5;
const lookSensitivity = 0.002;

function updateCameraRotation() {
  camera.rotation.order = "YXZ";
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;
}

function startGame() {
  started = true;
  startScreen.classList.add("hidden");
  hud.classList.add("visible");
  messageDisplay.textContent = "WASD to move · Mouse to look";

  if (matchMedia("(pointer: fine)").matches) {
    renderer.domElement.requestPointerLock?.();
  }
}

startButton.addEventListener("click", startGame);

document.addEventListener("pointerlockchange", () => {
  pointerLocked =
    document.pointerLockElement === renderer.domElement;

  if (started && !pointerLocked) {
    messageDisplay.textContent = "Click the game to capture your mouse";
  }
});

renderer.domElement.addEventListener("click", () => {
  if (started && matchMedia("(pointer: fine)").matches && !pointerLocked) {
    renderer.domElement.requestPointerLock?.();
  }
});

document.addEventListener("mousemove", (event) => {
  if (!started || !pointerLocked) return;

  yaw -= event.movementX * lookSensitivity;
  pitch -= event.movementY * lookSensitivity;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2 + 0.05,
    Math.PI / 2 - 0.05
  );

  updateCameraRotation();
});

document.addEventListener("keydown", (event) => {
  keys.add(event.code);
});

document.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

window.addEventListener("blur", () => {
  keys.clear();
});

function updateMovement(delta) {
  if (!started) return;

  const forward = new THREE.Vector3(
    -Math.sin(yaw),
    0,
    -Math.cos(yaw)
  );

  const right = new THREE.Vector3(
    Math.cos(yaw),
    0,
    -Math.sin(yaw)
  );

  const direction = new THREE.Vector3();

  if (keys.has("KeyW") || keys.has("ArrowUp")) {
    direction.add(forward);
  }

  if (keys.has("KeyS") || keys.has("ArrowDown")) {
    direction.sub(forward);
  }

  if (keys.has("KeyD") || keys.has("ArrowRight")) {
    direction.add(right);
  }

  if (keys.has("KeyA") || keys.has("ArrowLeft")) {
    direction.sub(right);
  }

  if (direction.lengthSq() > 0) {
    direction.normalize();

    const nextPosition = camera.position.clone().addScaledVector(
      direction,
      moveSpeed * delta
    );

    nextPosition.y = 1.7;

    const inThroat = nextPosition.z > -18;

    const horizontalLimit = inThroat ? 2.05 : 7.4;

    nextPosition.x = THREE.MathUtils.clamp(
      nextPosition.x,
      -horizontalLimit,
      horizontalLimit
    );

    nextPosition.z = THREE.MathUtils.clamp(
      nextPosition.z,
      -40,
      9
    );

    camera.position.copy(nextPosition);
  }

  if (camera.position.z > -17) {
    locationDisplay.textContent = "THROAT";
  } else {
    locationDisplay.textContent = "STOMACH CHAMBER";
  }
}

let previousTime = 0;

function animate(time) {
  requestAnimationFrame(animate);

  const delta = Math.min(
    (time - previousTime) / 1000,
    0.05
  );

  previousTime = time;

  updateMovement(delta);
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
});
