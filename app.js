import * as THREE from "three";

/* =====================================================
   1. SCENE SETUP
   ===================================================== */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x100d16);

scene.fog = new THREE.Fog(
  0x100d16,
  22,
  85
);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.05,
  200
);

camera.rotation.order = "YXZ";

// Start just outside the mouth.
camera.position.set(0, 7, 2.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 1.75)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

document.body.appendChild(renderer.domElement);


/* =====================================================
   2. LIGHTING
   ===================================================== */

scene.add(
  new THREE.HemisphereLight(
    0xffdce6,
    0x281625,
    2
  )
);

const mainLight = new THREE.DirectionalLight(
  0xffc5d3,
  2
);

mainLight.position.set(5, 12, 8);

scene.add(mainLight);


/* =====================================================
   3. WORLD AND MATERIALS
   ===================================================== */

const world = new THREE.Group();

scene.add(world);

// Collision boxes are added to this array.
const colliders = [];

function createMaterial(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    ...extra
  });
}

const skinMaterial = createMaterial(0xa65e72, {
  transparent: true,
  opacity: 0.24,
  depthWrite: false
});

const innerMaterial = createMaterial(0x74364e);
const wallMaterial = createMaterial(0x54273d);
const floorMaterial = createMaterial(0x30202f);

const stomachMaterial = createMaterial(0xb94c65);
const heartMaterial = createMaterial(0xe34c68);
const lungMaterial = createMaterial(0x788eb7);
const highlightMaterial = createMaterial(0xe18b9d);


/* =====================================================
   4. BASIC SHAPE HELPERS
   ===================================================== */

// Add a mesh at a specific position.
function addMesh(
  geometry,
  material,
  position,
  parent = world
) {
  const mesh = new THREE.Mesh(
    geometry,
    material
  );

  mesh.position.set(...position);

  parent.add(mesh);

  return mesh;
}


// Create a scaled sphere.
function addSphere(
  position,
  scale,
  material,
  parent = world
) {
  const mesh = addMesh(
    new THREE.SphereGeometry(1, 32, 24),
    material,
    position,
    parent
  );

  mesh.scale.set(...scale);

  return mesh;
}


// Create a box and optionally make it solid.
function addBox(
  position,
  size,
  material,
  solid = false
) {
  const mesh = addMesh(
    new THREE.BoxGeometry(...size),
    material,
    position
  );

  if (solid) {
    colliders.push({
      min: new THREE.Vector3(
        position[0] - size[0] / 2,
        position[1] - size[1] / 2,
        position[2] - size[2] / 2
      ),

      max: new THREE.Vector3(
        position[0] + size[0] / 2,
        position[1] + size[1] / 2,
        position[2] + size[2] / 2
      )
    });
  }

  return mesh;
}


/* =====================================================
   5. SIGNS
   ===================================================== */

// Signs use canvas textures, so no image files are needed.
function addSign(text, position, rotationY = 0) {
  const canvas = document.createElement("canvas");

  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#281722";
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = "#f5a0b5";
  ctx.lineWidth = 6;

  ctx.strokeRect(5, 5, 502, 118);

  ctx.fillStyle = "#ffe4eb";

  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, 256, 64, 470);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  const signMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const sign = addMesh(
    new THREE.PlaneGeometry(4, 1),
    signMaterial,
    position
  );

  sign.rotation.y = rotationY;

  return sign;
}


/* =====================================================
   6. EXTERIOR BODY
   ===================================================== */

// A translucent exterior hints at the human silhouette.
// It is visual only, so it does not block the entrance.

addSphere(
  [0, 9.1, -2],
  [4, 4.7, 3.1],
  skinMaterial
);

// Mouth opening.
addSphere(
  [0, 8.4, 0.45],
  [1.45, 0.58, 0.35],
  createMaterial(0x28121f)
);

// Lower lip.
addSphere(
  [0, 8.2, 0.55],
  [1.1, 0.12, 0.12],
  highlightMaterial
);

// Torso silhouette.
addSphere(
  [0, 1.5, -2],
  [5.3, 7, 3],
  skinMaterial
);


/* =====================================================
   7. MOUTH AND THROAT
   ===================================================== */

// Main throat corridor.
// The player travels in the negative Z direction.

addBox(
  [0, 5.4, -7],
  [4, 0.35, 17],
  floorMaterial,
  true
);

addBox(
  [0, 8.4, -7],
  [4, 0.25, 17],
  wallMaterial,
  true
);

addBox(
  [-2, 6.9, -7],
  [0.25, 3, 17],
  innerMaterial,
  true
);

addBox(
  [2, 6.9, -7],
  [0.25, 3, 17],
  innerMaterial,
  true
);

// Decorative tunnel lining.
addSphere(
  [0, 7.4, -2],
  [1.2, 1.2, 1.3],
  innerMaterial
);

addSign(
  "MOUTH -> THROAT",
  [0, 7.7, -3]
);


/* =====================================================
   8. STOMACH CHAMBER
   ===================================================== */

// A larger room at the end of the throat.

addBox(
  [0, 5.2, -14.5],
  [11, 0.35, 9],
  floorMaterial,
  true
);

addBox(
  [0, 9.4, -14.5],
  [11, 0.3, 9],
  wallMaterial,
  true
);

addBox(
  [-5.5, 7.3, -14.5],
  [0.3, 4.2, 9],
  innerMaterial,
  true
);

addBox(
  [5.5, 7.3, -14.5],
  [0.3, 4.2, 9],
  innerMaterial,
  true
);

// Stomach model.
addSphere(
  [0, 7, -14.5],
  [2.5, 2, 2.1],
  stomachMaterial
);

// A smaller fold adds a little visual detail.
addSphere(
  [-1, 7.5, -13.5],
  [1.1, 0.8, 0.7],
  highlightMaterial
);

addSign(
  "STOMACH",
  [0, 8.8, -11.5]
);

addSign(
  "FOOD PROCESSING DEPT.",
  [0, 6.5, -17.5],
  Math.PI
);


/* =====================================================
   9. ORGAN GALLERY
   ===================================================== */

// Side chamber to the right of the stomach.
// The opening is at the right-hand side of the room.

addBox(
  [7.5, 5.2, -14.5],
  [5, 0.35, 8],
  floorMaterial,
  true
);

addBox(
  [7.5, 9.4, -14.5],
  [5, 0.3, 8],
  wallMaterial,
  true
);

addBox(
  [7.5, 7.3, -18.5],
  [5, 4.2, 0.3],
  innerMaterial,
  true
);

addBox(
  [7.5, 7.3, -10.5],
  [5, 4.2, 0.3],
  innerMaterial,
  true
);

addBox(
  [10, 7.3, -14.5],
  [0.3, 4.2, 8],
  innerMaterial,
  true
);

// Simplified lungs.
addSphere(
  [6.4, 7.1, -14],
  [1, 1.6, 1],
  lungMaterial
);

addSphere(
  [8.5, 7.1, -14],
  [1, 1.6, 1],
  lungMaterial
);

// Heart.
addSphere(
  [7.5, 6.6, -13.2],
  [0.7, 0.9, 0.65],
  heartMaterial
);

// A simple vessel above the heart.
addMesh(
  new THREE.CylinderGeometry(
    0.15,
    0.15,
    1.4,
    16
  ),
  highlightMaterial,
  [7.5, 8.1, -14]
);

addSign(
  "LUNGS + HEART",
  [7.5, 8.8, -17.8]
);

addSign(
  "ORGAN GALLERY",
  [7.5, 8.8, -10.8],
  Math.PI / 2
);


/* =====================================================
   10. ENVIRONMENT PARTICLES
   ===================================================== */

// Tiny floating particles give the world some atmosphere.

const particlePositions = [];

for (let i = 0; i < 200; i++) {
  particlePositions.push(
    (Math.random() - 0.5) * 20,
    5 + Math.random() * 4,
    -Math.random() * 27
  );
}

const particleGeometry = new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    particlePositions,
    3
  )
);

const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({
    color: 0xffb7ca,
    size: 0.055,
    transparent: true,
    opacity: 0.5
  })
);

world.add(particles);


/* =====================================================
   11. PLAYER CONTROLS
   ===================================================== */

const keys = new Set();
const touchMoves = new Set();

let yaw = 0;
let pitch = -0.04;

let started = false;
let pointerLocked = false;

const playerRadius = 0.3;
const moveSpeed = 5.5;
const lookSensitivity = 0.0022;

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}


// Start the game independently of mouse-lock success.
startButton.addEventListener("click", async () => {
  started = true;

  startScreen.classList.add("hidden");

  if (!isTouchDevice()) {
    try {
      await renderer.domElement.requestPointerLock();
    } catch (error) {
      console.warn("Mouse lock unavailable:", error);
      messageDisplay.textContent =
        "Click the game to enable mouse look.";
    }
  }
});


// Track mouse lock without interrupting the game.
document.addEventListener("pointerlockchange", () => {
  pointerLocked =
    document.pointerLockElement === renderer.domElement;
});
document.addEventListener("mousemove", (event) => {
  if (!pointerLocked) return;

  yaw -= event.movementX * lookSensitivity;
  pitch -= event.movementY * lookSensitivity;

  pitch = THREE.MathUtils.clamp(
    pitch,
    -Math.PI / 2 + 0.03,
    Math.PI / 2 - 0.03
  );
});

renderer.domElement.addEventListener("click", () => {
  if (started && !isTouchDevice() && !pointerLocked) {
    renderer.domElement.requestPointerLock();
  }
});


// Keyboard input.
document.addEventListener("keydown", (event) => {
  keys.add(event.code);

  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft",
     "ArrowRight", "Space"].includes(event.code)
  ) {
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

window.addEventListener("blur", () => {
  keys.clear();
  touchMoves.clear();
});


/* =====================================================
   12. MOBILE INPUT
   ===================================================== */

// Hold the buttons to move.

document.querySelectorAll("[data-move]").forEach((button) => {
  const move = button.dataset.move;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    touchMoves.add(move);
  });

  const release = (event) => {
    event.preventDefault();
    touchMoves.delete(move);
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);

  button.addEventListener("pointerleave", (event) => {
    if (event.buttons === 0) {
      touchMoves.delete(move);
    }
  });
});


// Drag across the screen to look around on touch devices.
let lastTouch = null;

renderer.domElement.addEventListener(
  "touchstart",
  (event) => {
    if (!started || event.touches.length !== 1) return;

    const touch = event.touches[0];

    // Keep the left-hand side available for movement buttons.
    if (touch.clientX > window.innerWidth * 0.36) {
      lastTouch = {
        x: touch.clientX,
        y: touch.clientY
      };
    }
  },
  { passive: true }
);

renderer.domElement.addEventListener(
  "touchmove",
  (event) => {
    if (!lastTouch || event.touches.length !== 1) return;

    const touch = event.touches[0];

    yaw -= (touch.clientX - lastTouch.x) * 0.006;
    pitch -= (touch.clientY - lastTouch.y) * 0.006;

    pitch = THREE.MathUtils.clamp(
      pitch,
      -Math.PI / 2 + 0.03,
      Math.PI / 2 - 0.03
    );

    lastTouch = {
      x: touch.clientX,
      y: touch.clientY
    };
  },
  { passive: true }
);

renderer.domElement.addEventListener("touchend", () => {
  lastTouch = null;
});


/* =====================================================
   13. COLLISION
   ===================================================== */

// Check whether the player overlaps any solid box.

function collides(position) {
  for (const box of colliders) {
    const overlaps =
      position.x + playerRadius > box.min.x &&
      position.x - playerRadius < box.max.x &&

      position.y + playerRadius > box.min.y &&
      position.y - playerRadius < box.max.y &&

      position.z + playerRadius > box.min.z &&
      position.z - playerRadius < box.max.z;

    if (overlaps) return true;
  }

  return false;
}


// Read the currently held movement controls.
function getInput() {
  return {
    forward:
      keys.has("KeyW") ||
      keys.has("ArrowUp") ||
      touchMoves.has("forward"),

    backward:
      keys.has("KeyS") ||
      keys.has("ArrowDown") ||
      touchMoves.has("backward"),

    left:
      keys.has("KeyA") ||
      keys.has("ArrowLeft") ||
      touchMoves.has("left"),

    right:
      keys.has("KeyD") ||
      keys.has("ArrowRight") ||
      touchMoves.has("right"),

    up:
      keys.has("Space") ||
      touchMoves.has("up"),

    down:
      keys.has("ShiftLeft") ||
      keys.has("ShiftRight") ||
      touchMoves.has("down")
  };
}


/* =====================================================
   14. LOCATION DISPLAY
   ===================================================== */

const locationDisplay = document.getElementById("location");
const messageDisplay = document.getElementById("message");

function updateLocation() {
  const { x, y, z } = camera.position;

  let location = "Mouth Entrance";
  let message = "Move forward to enter the mouth.";

  if (z <= 0 && z > -4.5) {
    location = "Mouth";
    message = "Welcome inside. Follow the tunnel downward.";
  } else if (z <= -4.5 && z > -10) {
    location = "Throat";
    message = "Keep going. The stomach is just ahead.";
  } else if (x > 4.5 && z < -10 && z > -19) {
    location = "Organ Gallery";
    message = "Explore the heart and lungs.";
  } else if (z <= -10 && x <= 4.5) {
    location = "Stomach Chamber";
    message = "You found the stomach. Look for the side passage.";
  }

  if (y < 5.7) {
    message = "Careful! You're close to the lower wall.";
  }

  locationDisplay.textContent = location;
  messageDisplay.textContent = message;
}


/* =====================================================
   15. GAME LOOP
   ===================================================== */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(
    clock.getDelta(),
    0.05
  );

  if (started) {
    const input = getInput();

    const forwardAxis =
      Number(input.forward) -
      Number(input.backward);

    const sideAxis =
      Number(input.right) -
      Number(input.left);

    const verticalAxis =
      Number(input.up) -
      Number(input.down);

    // Forward and sideways movement follow camera direction.
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

    const movement = new THREE.Vector3();

    movement.addScaledVector(
      forward,
      forwardAxis
    );

    movement.addScaledVector(
      right,
      sideAxis
    );

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(
        moveSpeed * delta
      );
    }

    movement.y = verticalAxis * moveSpeed * delta;

    // Test each axis separately to slide along walls.
    const nextX = camera.position.clone();
    nextX.x += movement.x;

    if (!collides(nextX)) {
      camera.position.x = nextX.x;
    }

    const nextZ = camera.position.clone();
    nextZ.z += movement.z;

    if (!collides(nextZ)) {
      camera.position.z = nextZ.z;
    }

    const nextY = camera.position.clone();
    nextY.y += movement.y;

    if (!collides(nextY)) {
      camera.position.y = nextY.y;
    }

    // Apply first-person camera rotation.
    camera.rotation.set(
      pitch,
      yaw,
      0,
      "YXZ"
    );

    updateLocation();
  }

  renderer.render(scene, camera);
}

animate();


/* =====================================================
   16. RESIZE
   ===================================================== */

window.addEventListener("resize", () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.75)
  );
});
```
