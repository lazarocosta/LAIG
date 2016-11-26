/**
 * Vehicle
 * @constructor
 */
function Vehicle(scene) {
	CGFobject.call(this, scene);


var points= [
    [-0.048, -0.491, -0.000, 1],
    [-0.048, -0.491, -0.000, 1],
    [-0.048, -0.491, 0.000, 1],
    [-0.048, -0.491, -0.000, 1],
    [-0.048, -0.491, -0.000, 1],
    [-0.048, -0.491, -0.000, 1],

    [0.000,	-1.000,	0.400, 1],
    [-1.000, -1.000, 0.400, 1],
    [-1.000, 1.000,	0.400, 1],
    [1.000,	1.000,	0.400, 1],
    [1.000,	-1.000,	0.400, 1],
    [0.000,	-1.000,	0.400, 1],

    [0.000,	-1.000,	0.800, 1],
    [-1.000, -1.000, 0.800, 1],
    [-1.000, 1.000,	0.800, 1],
    [1.000,	1.000,	0.800, 1],
    [1.000,	-1.000,	0.800, 1],
    [0.000,	-1.000,	0.800, 1],

    [0.000,	-1.000,	1.200, 1],
    [-1.000, -1.000, 1.200, 1],
    [-1.000, 1.000,	1.200, 1],
    [1.000,	1.000,	1.200, 1],
    [1.000,	-1.000,	1.200, 1],
    [0.000,	-1.000,	1.200, 1],

    [0.000,	-1.000,	1.600, 1],
    [-1.000, -1.000, 1.600, 1],
    [-1.000, 1.000,	1.600, 1],
    [1.000,	1.000,	1.600, 1],
    [1.000,	-1.000,	1.600, 1],
    [0.000,	-1.000,	1.600, 1],

    [0.000,	-1.000,	2.000, 1],
    [-1.000, -1.000, 2.000, 1],
    [-1.000, 1.000,	2.000, 1],
    [1.000,	1.000,	2.000, 1],
    [1.000,	-1.000,	2.000, 1],
    [0.000,	-1.000,	2.000, 1]
];

var points2 =[
    [-0.651,	-0.848,	-0.906, 1],
    [-0.910,	-0.512,	-0.988, 1],
    [-1.062,	0.419,	-0.908, 1],
    [-0.733,	0.474,	-0.859, 1],

    [-0.518,	-1.202,	-0.917, 1],
    [-0.474,	-0.498,	0.326, 1],
    [-0.524,	0.386,	0.248, 1],
    [-0.577,	0.764,	-0.894, 1],

    [0.499,	-1.216,	-0.902, 1],
    [0.557,	-0.622,	0.308, 1],
    [0.568,	0.381,	0.290, 1],
    [0.444,	0.811,	-0.834, 1],

    [0.764,	-0.886,	-0.956, 1],
    [1.104,	-0.504,	-0.961, 1],
    [1.074,	0.505,	-0.983, 1],
    [0.697,	0.580,	-0.893, 1]
];

    this.angle=0;
    this.increment= 10;

    this.body= new Patch(this.scene, 5,5,20,20, points);
    this.copa = new Patch(this.scene, 3,3,20,20, points2);
	this.circle = new Circle(this.scene,0.3,20);
    this.torus = new Torus(this.scene, 0.2, 0.45, 30, 5);
    this.update();

    this.vermelhoAppear = new CGFappearance(scene);
    this.vermelhoAppear.loadTexture("resources\\vermelho.jpg" );

    this.pretoAppear = new CGFappearance(scene);
    this.pretoAppear.loadTexture("resources\\preto.jpg" );

    this.vidroAppear = new CGFappearance(scene);
    this.vidroAppear.loadTexture("resources\\vidro.jpg" );

};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.update = function () {
    this.angle +=this.increment* Math.PI/180;
}

Vehicle.prototype.display = function () {
    this.scene.pushMatrix();

    //this.scene.rotate(this.angle, 0,1,0);
    //this.scene.translate(5,5,0);

    this.scene.pushMatrix();
    this.vermelhoAppear.apply();
	this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,-0.38,2);
	this.circle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.pretoAppear.apply();
    this.scene.translate(0,-0.37,2);
    this.torus.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
     this.vidroAppear.apply();
    this.scene.translate(0,0.7,1.2);
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.scale(0.5,0.5,0.8);
    this.copa.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
};
