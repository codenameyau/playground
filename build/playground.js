/*!
 * playground.js - v1.0.3
 * MIT License (c) 2015
 * https://github.com/codenameyau/playground
 */
'use strict';

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function Playground() {
  // Properties Overview.
  this.version = 'v1.0.1';
  this.clock = null;
  this.scene = null;
  this.renderer = null;
  this.camera = null;
  this.controls = null;
  this.settings = {};
  this.animation = null;

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
  // Custom playground settings.
  this.settings.dom = '#threejs-canvas';
  this.settings.grid = false;

  // WebGL renderer settings.
  this.settings.renderer = {
    antialias: false,
  };

  // Intial camera settings.
  this.settings.camera = {
    fov: 45, near: 1, far: 1000,
    zoom: { x: 0, y: 20, z: 50 },
  };

  // Orbit control settings.
  this.settings.controls = {
    enabled: true,
    userPan: false,
    userPanSpeed: 0.5,
    minDistance: 10.0,
    maxDistance: 600.0,
    maxPolarAngle: (Math.PI/180) * 85,
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
  this.utils.addToDOM(this.settings.dom, this.renderer.domElement);
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
    if (this.animation) { this.animation(); }
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

Playground.prototype.setAnimation = function(callback) {
  if (callback && typeof(callback) === 'function') {
    this.animation = callback;
  }
};

Playground.prototype.clearAnimation = function() {
  this.animation = null;
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
  this.settings.grid = true;
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
  if (this.settings.grid) { this.enableGrid(); }
  this._callback(callback);
};


/********************************************************************
* UTILITIES
*********************************************************************/
Playground.prototype.utils = {};

Playground.prototype.utils.addToDOM = function(selector, element) {
  var container = document.querySelector(selector);
  if (container) {
    container.appendChild(element);
  }
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

Playground.prototype.utils.randomExclusive = function(min, max) {
  return parseInt(Math.random() * (max - min) + min, 10);
};

Playground.prototype.utils.randomInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Playground.prototype.utils.randomNormal = function(min, max) {
  var valueA = this.randomInclusive(min, max);
  var valueB = this.randomInclusive(min, max);
  return parseInt((valueA + valueB) / 2, 10);
};


/********************************************************************
* HUD METHODS
*********************************************************************/
Playground.prototype.enablePausedHUD = function() {
  var container = document.createElement('div');
  container.className = 'pause-hud';
  container.textContent = 'Paused';

  var stylesheet = new StyleSheet();
  stylesheet.setSelector('.pause-hud');
  stylesheet.insertRule('width: 100%');
  stylesheet.insertRule('height: 100%');
  stylesheet.insertRule('text-align: center');
  stylesheet.insertRule('display: none');
  stylesheet.insertRule('z-index: 100');
  stylesheet.insertRule('color: #ffffff');
  stylesheet.insertRule('text-transform: uppercase');
  stylesheet.insertRule('font-size: 32px');
  stylesheet.insertRule('letter-spacing: 6px');
  stylesheet.insertRule('position: absolute');
  stylesheet.insertRule('top: 0');
  stylesheet.insertRule('padding: 20% 0 0 0');
  stylesheet.insertRule('background: rgba(0, 0, 0, 0.5)');
  stylesheet.insertRule('cursor: default');
  stylesheet.applyRules();

  this.utils.addToDOM(this.settings.dom, container);
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

/*!
 * stylesheet - v1.0.1
 * MIT License (c) 2015
 * https://github.com/codenameyau/stylesheet
 */
'use strict';


/********************************************************************
* STYLESHEET CONSTRUCTOR
*********************************************************************/
function StyleSheet() {
  this.style = document.createElement('style');
  document.head.appendChild(this.style);
  this.index = document.styleSheets.length - 1;
  this.sheet = document.styleSheets[this.index];
  this.selector = '';
  this.buffer = [];
  this.insertMethod = null;

  // Cross-browser compatability to insert rules.
  if('insertRule' in this.sheet) {
    this.insertMethod = this._insertRuleMethod;
  } else if('addRule' in this.sheet) {
    this.insertMethod = this._addRuleMethod;
  }
}


/********************************************************************
* STYLESHEET PUBLIC METHODS
*********************************************************************/
StyleSheet.prototype.setSelector = function(selector) {
  this.selector = selector;
};

StyleSheet.prototype.insertRule = function(rule) {
  this.buffer.push(rule);
};

StyleSheet.prototype.applyRules = function() {
  var rules = this.buffer.join('; ');
  this.insertMethod(this.selector, rules);
  this.clearBuffer();
};

StyleSheet.prototype.clearBuffer = function() {
  this.buffer = [];
};

StyleSheet.prototype.enable = function() {
  this.sheet.disabled = false;
};

StyleSheet.prototype.disable = function() {
  this.sheet.disabled = true;
};


/********************************************************************
* STYLESHEET INTERNAL METHODS
*********************************************************************/
StyleSheet.prototype._insertRuleMethod = function(selector, rules) {
  this.sheet.insertRule(selector + '{' + rules + '}', 0);
};

StyleSheet.prototype._addRuleMethod = function(selector, rules) {
  this.sheet.addRule(selector, rules, 0);
};
