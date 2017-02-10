'use strict';

// Initialize engine with options.
var options = { dom: '#threejs-canvas', antialias: true };
var core = new ThreeJSCore(options);
core.enableGrid(40, 4);
core.setCameraPosition(0, 60, 90);

// Light sources.
var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
var lightSource = new THREE.PointLight(0xAAEa7a);
lightSource.position.set(0, 20, 70);
core.scene.add(lightAmbient);
core.scene.add(lightSource);

// Add Box mesh.
var size = 8;
var material = new THREE.MeshLambertMaterial();
var geometry = new THREE.BoxGeometry(size, size, size);
geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, size/2, 0) );
var boxMesh = new THREE.Mesh(geometry, material);
core.scene.add(boxMesh);
