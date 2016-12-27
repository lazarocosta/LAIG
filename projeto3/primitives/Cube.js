/**
 * Cube
 * @constructor
 */
function Cube(scene) {
    CGFobject.call(this, scene);

    this.quad = new Rectangle(scene, -1, -1, 1, 1);
    this.scene = scene;
};

Cube.prototype = Object.create(CGFobject.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.display = function() {
    // front face
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();

    // back face
    this.scene.pushMatrix();
    this.scene.rotate(180 * degToRad, 1, 0, 0);
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();

    // top face
    this.scene.pushMatrix();
    this.scene.rotate(-90 * degToRad, 1, 0, 0);
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();

    // back face
    this.scene.pushMatrix();
    this.scene.rotate(90 * degToRad, 1, 0, 0);
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();

    // right face
    this.scene.pushMatrix();
    this.scene.rotate(-90 * degToRad, 0, 1, 0);
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();

    // left face
    this.scene.pushMatrix();
    this.scene.rotate(90 * degToRad, 0, 1, 0);
    this.scene.translate(0, 0, 1);
    this.quad.display();
    this.scene.popMatrix();
};