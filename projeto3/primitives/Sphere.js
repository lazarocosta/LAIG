/**
 * Sphere
 * @constructor
 */
function Sphere(scene, slices, stacks, radius) {


  this.slices = slices;
  this.stacks = stacks;
  this.radius = radius;

  CGFobject.call(this, scene);
  this.initBuffers();
}

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function () {
  /*
   * TODO:
   * Replace the following lines in order to build a prism with a **single mesh**.
   *
   * How can the vertices, indices and normals arrays be defined to
   * build a prism with varying number of slices and stacks?
   */

  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  var ang = 2 * Math.PI / this.slices;
  var ang_vert = Math.PI / this.stacks;
  var s, t;
  var x, y, z;

  //Vertices & Normals
  for (var ind = this.stacks; ind >= 0; ind--) {


    for (var m = 0; m < this.slices; m++) {

      x = Math.cos(ang * m) * Math.sin(ang_vert * ind);
      y = Math.sin(ang * m) * Math.sin(ang_vert * ind);
      z = Math.cos(ang_vert * ind);

      this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
      this.normals.push(x, y, z);

      s = 1 - (ind / this.stacks);
      t = 1 - (m / this.slices);
      this.texCoords.push(s, t);
    }
  }

  //Indices
  for (var j = 0; j < this.stacks; j++) {
    for (var i = 0; i < (this.slices); i += 1) {
      this.indices.push((i + 1) % (this.slices) + (j + 0) * this.slices,
        (i + 0) % (this.slices) + (j + 1) * this.slices,
        (i + 0) % (this.slices) + (j + 0) * this.slices);

      this.indices.push((i + 0) % (this.slices) + (j + 1) * this.slices,
        (i + 1) % (this.slices) + (j + 0) * this.slices,
        (i + 1) % (this.slices) + (j + 1) * this.slices);
    }

  }

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
