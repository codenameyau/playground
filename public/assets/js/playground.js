/*!
 * playground.js
 * MIT License (c) 2015
 * codenameyau.github.io
 */
'use strict';

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function Playground() {
  // Initialize properties.
  this.settings = {};
  this.HUD = {};
  this.clock = null;
  this.renderer = null;
  this.scene = null;
  this.camera = null;

  // Intialize core functionality.
  this._initializeSettings();
  this._initializeClock();
  this._initializeScene();
  this._initializeCamera();
  this._initializeControls();
  this._initializeHUD();
  this._initializeEventListeners();
  this.updateScene();
}

Playground.prototype._initializeSettings = function() {
  this.settings.meta = {
    dom: 'threejs-canvas',
  };

  this.settings.renderer = {
    antialias: false,
  };

  this.settings.camera = {
    fov: 45,
    near: 1,
    far: 1000,
    zoomX: 0,
    zoomY: 20,
    zoomZ: 50,
  };

  this.settings.controls = {
    enabled: true,
    userPan: false,
    userPanSpeed: 0.5,
    minDistance: 10.0,
    maxDistance: 200.0,
    maxPolarAngle: (Math.PI/180) * 85,
  };
};

Playground.prototype._initializeClock = function() {
  this.clock = new THREE.Clock();
  this.clock.delta = this.clock.getDelta();
};

Playground.prototype._initializeScene = function() {
  this.scene = new THREE.Scene();
  this.renderer = new THREE.WebGLRenderer(this.settings.renderer);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.utils.addToDOM(this.settings.meta.dom, this.renderer.domElement);
  this.renderer.running = true;
};

Playground.prototype._initializeCamera = function() {
  var set = this.settings.camera;
  var aspect = window.innerWidth/window.innerHeight;
  this.camera = new THREE.PerspectiveCamera(set.fov, aspect, set.near, set.far);
  this.camera.position.set(set.zoomX, set.zoomY, set.zoomZ);
  this.camera.lookAt(this.scene.position);
  this.scene.add(this.camera);
};

Playground.prototype._initializeControls = function() {
  var set = this.settings.controls;
  this.controls = new THREE.OrbitControls(this.camera);
  for (var key in set) { this.controls[key] = set[key]; }
};

Playground.prototype._initializeHUD = function() {
  this.enablePausedHUD();
};

Playground.prototype._initializeEventListeners = function() {
  window.addEventListener('resize', this.resizeWindow.bind(this), false);
  window.addEventListener('focus', this.resumeClock.bind(this), false);
  window.addEventListener('blur', this.pauseClock.bind(this), false);
  window.addEventListener('keydown', this.keyboardInput.bind(this), false);
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
  }
  else {
    this.HUD.paused.style.display = 'none';
    this.controls.enabled = true;
    this.resumeRenderer();
  }
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

Playground.prototype.loadScene = function(callback) {
  callback.bind(this)();
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
  return Math.PI/180 * degrees;
};

Playground.prototype.utils.radToDeg = function(radians) {
  return 180/Math.PI * radians;
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

  // spacebar: toggle pause
  case 32:
    event.preventDefault();
    this.togglePause();
    break;
  }
};
