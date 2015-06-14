/*!
 * playground.js - v1.0.0
 * MIT License (c) 2015
 * https://github.com/codenameyau/playground
 */
'use strict';

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function Playground() {
  // Properties Overview.
  this.version = 'v1.0.0';
  this.clock = null;
  this.scene = null;
  this.renderer = null;
  this.camera = null;
  this.controls = null;

  // Initialize object properties.
  this._initializeSettings();
  this._intializeKeycodes();
  this._initializeClock();
  this._initializeScene();
  this._initializeRenderer();
  this._initializeCamera();
  this._initializeControls();
  this._initializeHUD();
  this._initializeEventListeners();
  this.updateScene();
}

Playground.prototype._initializeSettings = function() {
  this.settings = {
    meta: {
      dom: 'threejs-canvas',
    },

    renderer: {
      antialias: false,
    },

    scene: {
      grid: false,
    },

    camera: {
      fov: 45, near: 1, far: 1000,
      zoom: { x: 0, y: 20, z: 50 },
    },

    controls: {
      enabled: true,
      userPan: false,
      userPanSpeed: 0.5,
      minDistance: 10.0,
      maxDistance: 200.0,
      maxPolarAngle: (Math.PI/180) * 85,
    },
  };
};

Playground.prototype._intializeKeycodes = function() {
  // Qwerty keyboard.
  this.keycodes = {
    'backspace':  8,
    'tab':        9,
    'enter':     13,
    'shift':     16,
    'ctrl':      17,
    'alt':       18,
    'caps':      20,
    'esc':       27,
    'space':     32,
    'end':       35,
    'home':      36,
    'left':      37,
    'up':        38,
    'right':     39,
    'down':      40,
    '0':         48,
    '1':         49,
    '2':         50,
    '3':         51,
    '4':         52,
    '5':         53,
    '6':         54,
    '7':         55,
    '8':         56,
    '9':         57,
    'a':         65,
    'b':         66,
    'c':         67,
    'd':         68,
    'e':         69,
    'f':         70,
    'g':         71,
    'h':         72,
    'i':         73,
    'j':         74,
    'k':         75,
    'l':         76,
    'm':         77,
    'n':         78,
    'o':         79,
    'p':         80,
    'q':         81,
    'r':         82,
    's':         83,
    't':         84,
    'u':         85,
    'v':         86,
    'w':         87,
    'x':         88,
    'y':         89,
    'z':         90,
  };
};

Playground.prototype._initializeClock = function() {
  this.clock = new THREE.Clock();
  this.clock.delta = this.clock.getDelta();
};

Playground.prototype._initializeScene = function() {
  this.scene = new THREE.Scene();
};

Playground.prototype._initializeRenderer = function() {
  this.renderer = new THREE.WebGLRenderer(this.settings.renderer);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.utils.addToDOM(this.settings.meta.dom, this.renderer.domElement);
  this.renderer.running = true;
};

Playground.prototype._initializeCamera = function() {
  var c = this.settings.camera;
  var aspect = window.innerWidth/window.innerHeight;
  this.camera = new THREE.PerspectiveCamera(c.fov, aspect, c.near, c.far);
  this.camera.position.set(c.zoom.x, c.zoom.y, c.zoom.z);
  this.camera.lookAt(this.scene.position);
  this.scene.add(this.camera);
};

Playground.prototype._initializeControls = function() {
  var controls = this.settings.controls;
  this.controls = new THREE.OrbitControls(this.camera);
  for (var key in controls) { this.controls[key] = controls[key]; }
};

Playground.prototype._initializeHUD = function() {
  this.HUD = {};
  this.enablePausedHUD();
};

Playground.prototype._initializeEventListeners = function() {
  window.addEventListener('resize', this.resizeWindow.bind(this), false);
  window.addEventListener('focus', this.resumeClock.bind(this), false);
  window.addEventListener('blur', this.pauseClock.bind(this), false);
  window.addEventListener('keydown', this.keyboardInput.bind(this), false);
};

Playground.prototype._callback = function(callback) {
  if (callback && typeof(callback) === 'function') {
    callback.bind(this)();
  }
};

/********************************************************************
* CORE METHODS
*********************************************************************/
Playground.prototype.renderScene = function() {
  this.renderer.render(this.scene, this.camera);
};

Playground.prototype.updateScene = function() {
  if (this.renderer.running) {
    window.requestAnimationFrame(this.updateScene.bind(this));
    this.controls.update();
    this.renderScene();
  }
};

Playground.prototype.resizeWindow = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
};

Playground.prototype.resumeClock = function() {
  this.clock.start();
};

Playground.prototype.pauseClock = function() {
  this.clock.stop();
};

Playground.prototype.resumeRenderer = function() {
  this.renderer.running = true;
  this.resumeClock();
  window.requestAnimationFrame(this.updateScene.bind(this));
};

Playground.prototype.pauseRenderer = function() {
  this.renderer.running = false;
  this.pauseClock();
};

Playground.prototype.togglePause = function() {
  if (this.renderer.running) {
    this.HUD.paused.style.display = 'block';
    this.controls.enabled = false;
    this.pauseRenderer();
  } else {
    this.HUD.paused.style.display = 'none';
    this.controls.enabled = true;
    this.resumeRenderer();
  }
};

Playground.prototype.getKeycode = function(key) {
  return this.keycodes[key];
};


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
Playground.prototype.changeSettings = function(type, dictionary) {
  var setting = this.settings[type];
  for (var key in dictionary) {
    if (setting.hasOwnProperty(key)) {
      setting[key] = dictionary[key];
    }
  }
};

Playground.prototype.enableGrid = function(lines, steps, gridColor) {
  lines = lines || 20;
  steps = steps || 2;
  gridColor = gridColor || 0xFFFFFF;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  this.scene.add(new THREE.Line(floorGrid, gridLine, THREE.LinePieces));
  this.settings.scene.grid = true;
};

Playground.prototype.loadScene = function(callback) {
  this._callback(callback);
};

Playground.prototype.resetCamera = function(callback) {
  this._initializeCamera();
  this._initializeControls();
  this._callback(callback);
};

Playground.prototype.resetScene = function(callback) {
  this._initializeScene();
  this.resetCamera();
  if (this.settings.scene.grid) { this.enableGrid(); }
  this._callback(callback);
};


/********************************************************************
* UTILITIES
*********************************************************************/
Playground.prototype.utils = {};

Playground.prototype.utils.addToDOM = function(parent, element) {
  var container = document.getElementById(parent);
  container.appendChild(element);
};

Playground.prototype.utils.checkProperty = function(obj, property, value) {
  if (obj && typeof obj[property] !== 'undefined') {
    value = obj[property];
  } return value;
};

Playground.prototype.utils.degToRad = function(degrees) {
  return (Math.PI / 180) * degrees;
};

Playground.prototype.utils.radToDeg = function(radians) {
  return (180 / Math.PI) * radians;
};


/********************************************************************
* HUD METHODS
*********************************************************************/
Playground.prototype.enablePausedHUD = function() {
  var container = document.createElement('div');
  container.textContent = 'Paused';
  container.style.display = 'none';
  container.style.zIndex = '100';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.textAlign = 'center';
  container.style.color = '#ffffff';
  container.style.textTransform = 'uppercase';
  container.style.fontSize = '32px';
  container.style.letterSpacing = '6px';
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.padding = '20% 0 0 0';
  container.style.background = 'rgba(0, 0, 0, 0.5)';
  this.utils.addToDOM(this.settings.meta.dom, container);
  this.HUD.paused = container;
};


/********************************************************************
* EVENT LISTENERS
*********************************************************************/
Playground.prototype.keyboardInput = function(event) {
  switch (event.which) {

  // Toggle pause
  case this.keycodes.space:
    event.preventDefault();
    this.togglePause();
    break;

  // Reset camera
  case this.keycodes.r:
    event.preventDefault();
    this.resetCamera();
    break;
  }
};
