'use strict';

// Initialize engine with options.
var options = { dom: '#threejs-canvas', antialias: true };
var core = new ThreeJSCore(options);
core.enableGrid(40, 4);
core.scene.add(new THREE.AxisHelper(40));
core.setCameraPosition(0, 60, 90);

// Light sources.
var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
core.scene.add(lightAmbient);

// Add Box to scene.
var size = 8;
var material = new THREE.MeshLambertMaterial();
var geometry = new THREE.BoxGeometry(size, size, size);
geometry.applyMatrix( new THREE.Matrix4().makeTranslation(-size/2, size/2, size/2) );
var boxMesh = new THREE.Mesh(geometry, material);
core.scene.add(boxMesh);
