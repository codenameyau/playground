'use strict';

(function() {

  // Initialize playground.
  var playground = new Playground();
  playground.enableGrid(40, 5);

  // Update camera.
  playground.setCameraPosition(30, 60, 90);

  // Light sources.
  var lightAmbient = new THREE.AmbientLight(0x5a5a5a);
  var lightSource = new THREE.PointLight(0xAAEa7a);
  lightSource.position.set(0, 20, 70);
  playground.scene.add(lightAmbient);
  playground.scene.add(lightSource);

  // Box example.
  var size = 10;
  var material = new THREE.MeshLambertMaterial();
  var geometry = new THREE.BoxGeometry(size, size, size);
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, size/2, 0) );
  var boxMesh = new THREE.Mesh(geometry, material);
  playground.scene.add(boxMesh);

})();
