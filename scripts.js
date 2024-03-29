var scene, camera, renderer, displayModel;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

function init() {
  scene = new THREE.Scene();
  initDisplayModel();
  initCamera();
  initRenderer();

  var light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light2);

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
  camera.position.set(0, 3.5, 5);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setSize(WIDTH, HEIGHT);
}

function formatModel() {
  displayModel.scale.set(1, 1, 1);
  displayModel.position.set(0, 0, 0);
}

function initDisplayModel() {
  var loader = new THREE.GLTFLoader();

  loader.load("Models/cubeTest.glb", function(gltf) {
    displayModel = gltf.scene.children[0];
    formatModel();
    scene.add(displayModel);
  });
}

function render() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}
init();
render();

var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};

const toRadians = angle => {
  return angle * (Math.PI / 180);
};

const toDegrees = angle => {
  return angle * (180 / Math.PI);
};

const renderArea = renderer.domElement;

renderArea.addEventListener("mousedown", e => {
  isDragging = true;
});

renderArea.addEventListener("mousemove", e => {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };

  if (isDragging) {
    let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        "XYZ"
      )
    );

    displayModel.quaternion.multiplyQuaternions(
      deltaRotationQuaternion,
      displayModel.quaternion
    );
  }

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
});

document.addEventListener("mouseup", e => {
  isDragging = false;
});
