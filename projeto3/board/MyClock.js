/**
 * MyClock
 * @constructor
 */
function MyClock(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.angle = -6 * degToRad;
    this.timer = this.scene.playingTime;
    this.scene = scene;
    this.seconds = new Cylinder(scene, 0.02, 0.02, 0.9, 50, 50);
    this.circle = new Circle(scene, 1, 50);
    this.cilinder = new Cylinder(scene, 1, 1, 0.1, 50, 50);

    this.pretoAppear = new CGFappearance(scene);
    this.pretoAppear.loadTexture("resources\\preto.jpg");

    this.clockAppear = new CGFappearance(scene);
    this.clockAppear.loadTexture("resources\\relogio.jpg");
}

MyClock.prototype = Object.create(CGFobject.prototype);
MyClock.prototype.constructor = MyClock;


MyClock.prototype.updateTime = function(currTime) {
    this.timer -= currTime;
};

MyClock.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.rotate(180 * degToRad, 1, 0, 0);
    this.pretoAppear.apply();
    this.cilinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.01);
    this.clockAppear.apply();
    this.circle.display();
    this.scene.popMatrix();

    //============================
    this.scene.pushMatrix();
    this.scene.rotate(this.timer * this.angle, 0, 0, 1);
    this.scene.translate(0, 0, 0.05);
    this.scene.rotate(-90 * degToRad, 1, 0, 0);
    this.pretoAppear.apply();
    this.seconds.display();
    this.scene.popMatrix();
};