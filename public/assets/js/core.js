/*!
 * ThreeJSCore - core.js
 * Author: Jorge Yau <codenameyau@gmail.com>
 * https://github.com/codenameyau/playground/core
 * MIT License (c) 2017
 */
'use strict';

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function ThreeJSCore(options) {
  this.version = 'v2.0.0';
  this.options = options || {};
  this.clock = null;
  this.scene = null;
  this.animation = null;
  this.renderer = null;
  this.camera = null;
  this.controls = null;
  this.settings = {};
  this.HUD = {};

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

ThreeJSCore.prototype._initializeSettings = function() {
  // Custom playground settings.
  this.settings.dom = this.options.dom || '#threejs-canvas';
  this.settings.grid = false;

  // WebGL renderer settings.
  this.settings.renderer = {
    antialias: this.options.antialias || false
  };

  // Intial camera settings.
  this.settings.camera = {
    fov: 45, near: 0.5, far: 10000,
    pos: { x: 0, y: 60, z: 120 }
  };

  // Orbit control settings.
  this.settings.controls = {
    enabled: true,
    userPan: false,
    userPanSpeed: 0.5,
    minDistance: 10.0,
    maxDistance: 600.0,
    maxPolarAngle: (Math.PI / 180) * 85
  };

  // Initialize default animation.
  this.animation = this.defaultAnimation;
};

ThreeJSCore.prototype._intializeKeycodes = function() {
  // Qwerty keyboard.
  this.keycodes = {
    'backspace': 8, 'enter': 13, 'shift': 16, 'ctrl': 17, 'alt': 18,
    'caps': 20, 'esc': 27, 'space': 32, 'end': 35, 'home': 36,
    'left': 37, 'up': 38, 'right': 39, 'down': 40,
    '0': 48, '1': 49, '2': 50, '3': 51, '4': 52,
    '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
    'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71,
    'h': 72, 'i': 73, 'j': 74, 'k': 75, 'l': 76, 'm': 77, 'n': 78,
    'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 'u': 85,
    'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90
  };
};

ThreeJSCore.prototype._initializeClock = function() {
  this.clock = new THREE.Clock();
  this.clock.delta = this.clock.getDelta();
};

ThreeJSCore.prototype._initializeScene = function() {
  this.scene = new THREE.Scene();
};

ThreeJSCore.prototype._initializeRenderer = function() {
  this.renderer = new THREE.WebGLRenderer(this.settings.renderer);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.utils.addToDOM(this.settings.dom, this.renderer.domElement);
  this.renderer.running = true;
};

ThreeJSCore.prototype._initializeCamera = function() {
  var c = this.settings.camera;
  var aspect = window.innerWidth/window.innerHeight;
  this.camera = new THREE.PerspectiveCamera(c.fov, aspect, c.near, c.far);
  this.camera.position.set(c.pos.x, c.pos.y, c.pos.z);
  this.camera.lookAt(this.scene.position);
  this.scene.add(this.camera);
};

ThreeJSCore.prototype._initializeControls = function() {
  var controls = this.settings.controls;
  this.controls = new THREE.OrbitControls(this.camera);

  for (var key in controls) {
    if (!controls.hasOwnProperty(key)) { return; }
    this.controls[key] = controls[key];
  }
};

ThreeJSCore.prototype._initializeHUD = function() {
  this.enablePausedHUD();
};

ThreeJSCore.prototype._initializeEventListeners = function() {
  window.addEventListener('resize', this.resizeWindow.bind(this), false);
  window.addEventListener('focus', this.resumeClock.bind(this), false);
  window.addEventListener('blur', this.pauseClock.bind(this), false);
  window.addEventListener('keydown', this.keyboardInput.bind(this), false);
};

ThreeJSCore.prototype._callback = function(callback) {
  if (callback && typeof callback === 'function') {
    callback.bind(this)();
  }
};

/********************************************************************
* CORE METHODS
*********************************************************************/
ThreeJSCore.prototype.renderScene = function() {
  this.renderer.render(this.scene, this.camera);
};

ThreeJSCore.prototype.updateScene = function() {
  if (this.renderer.running) {
    window.requestAnimationFrame(this.updateScene.bind(this));
    this.animation();
  }
};

ThreeJSCore.prototype.resizeWindow = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
};

ThreeJSCore.prototype.resumeClock = function() {
  this.clock.start();
};

ThreeJSCore.prototype.pauseClock = function() {
  this.clock.stop();
};

ThreeJSCore.prototype.resumeRenderer = function() {
  this.renderer.running = true;
  this.resumeClock();
  window.requestAnimationFrame(this.updateScene.bind(this));
};

ThreeJSCore.prototype.pauseRenderer = function() {
  this.renderer.running = false;
  this.pauseClock();
};

ThreeJSCore.prototype.togglePause = function() {
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

ThreeJSCore.prototype.getKeycode = function(key) {
  return this.keycodes[key];
};

ThreeJSCore.prototype.defaultAnimation = function() {
  this.controls.update();
  this.renderScene();
};

ThreeJSCore.prototype.setAnimation = function(animationFunction) {
  this.animation = animationFunction;
};


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
ThreeJSCore.prototype.enableGrid = function(lines, steps, gridColor) {
  lines = lines || 80;
  steps = steps || 4;
  gridColor = gridColor || 0x444444;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  this.scene.add(new THREE.Line(floorGrid, gridLine, THREE.LinePieces));
  this.settings.grid = true;
};

ThreeJSCore.prototype.loadScene = function(callback) {
  this._callback(callback);
};

ThreeJSCore.prototype.setMaxCameraDistance = function(far) {
  this.settings.camera.far = far;
  this.camera.far = far;
  this.camera.updateProjectionMatrix();
};

ThreeJSCore.prototype.setCameraPosition = function(x, y, z) {
  this.camera.position.set(x, y, z);
  this.settings.camera.pos.x = x;
  this.settings.camera.pos.y = y;
  this.settings.camera.pos.z = z;
};

ThreeJSCore.prototype.resetCamera = function(callback) {
  this._initializeCamera();
  this._initializeControls();
  this._callback(callback);
};

ThreeJSCore.prototype.resetScene = function(callback) {
  this._initializeScene();
  this.resetCamera();
  if (this.settings.grid) { this.enableGrid(); }
  this._callback(callback);
};


/********************************************************************
* UTILITIES
*********************************************************************/
ThreeJSCore.prototype.utils = {};

ThreeJSCore.prototype.utils.addToDOM = function(selector, element) {
  var container = document.querySelector(selector);
  if (container) {
    container.appendChild(element);
  }
};

ThreeJSCore.prototype.utils.checkProperty = function(obj, property, value) {
  if (obj && typeof obj[property] !== 'undefined') {
    value = obj[property];
  } return value;
};

ThreeJSCore.prototype.utils.degToRad = function(degrees) {
  return (Math.PI / 180) * degrees;
};

ThreeJSCore.prototype.utils.radToDeg = function(radians) {
  return (180 / Math.PI) * radians;
};

ThreeJSCore.prototype.utils.random = function(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
};

ThreeJSCore.prototype.utils.randomInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

ThreeJSCore.prototype.utils.randomNormal = function(min, max) {
  var valueA = this.randomInclusive(min, max);
  var valueB = this.randomInclusive(min, max);
  return parseInt((valueA + valueB) / 2, 10);
};


/********************************************************************
* HUD METHODS
*********************************************************************/
ThreeJSCore.prototype.enablePausedHUD = function() {
  var container = document.createElement('div');
  container.className = 'threejs-core-pause';
  container.textContent = 'Paused';
  this.utils.addToDOM(this.settings.dom, container);
  this.HUD.paused = container;
};


/********************************************************************
* EVENT LISTENERS
*********************************************************************/
ThreeJSCore.prototype.keyboardInput = function(event) {
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
