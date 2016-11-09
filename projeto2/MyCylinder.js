/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, base, top, height, slices, stacks) {
	CGFobject.call(this, scene);

	this.slices = slices;
	this.stacks = stacks;
	this.base = base;
	this.top = top;
	this.height = height;

	this.circleTop = new MyCircle(this.scene, this.top, this.slices);
	this.circleBase = new MyCircle(this.scene, this.base, this.slices);




	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function () {
	/*
	* TODO:
	* Replace the following lines in order to build a prism with a **single mesh**.
	*
	* How can the vertices, indices and normals arrays be defined to
	* build a prism with varying number of slices and stacks?
	*/

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	var angle = Math.PI * 2 / this.slices;
	var incrementZ = this.height / this.stacks;
	var deltaRaio = (this.top - this.base) / this.stacks;

	for (j = 0; j <= this.stacks; j++) {

		var raio = this.base + j * deltaRaio;
		var z = j * incrementZ;

		for (i = 0; i < this.slices; i++) {
			var x = raio * Math.cos(angle * i);
			var y = raio * Math.sin(angle * i);
			this.vertices.push(x, y, z);
			this.normals.push(x, y, 0);

			var textCS = angle * i;
			var textCT = z;
			this.texCoords.push(textCS, textCT);
		}

	}

	//lados de fora
	for (j = 0; j < this.stacks; j++) {
		for (i = 0; i < this.slices - 1; i++) {
			var a = i + (j * this.slices);
			var b = i + ((j + 1) * this.slices);
			var c = i + 1 + (j * this.slices);
			var d = i + 1 + ((j + 1) * this.slices);
			this.indices.push(d, b, a);
			this.indices.push(a, c, d);
		}
		var a = j * this.slices;
		var b = (j + 1) * this.slices;
		var c = a + this.slices - 1;
		var d = b + this.slices - 1;

		this.indices.push(d, c, a);
		this.indices.push(a, b, d);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyCylinder.prototype.display = function () {

	CGFobject.prototype.display.call(this);
	this.scene.rotate(Math.PI, 1, 0, 0);
	this.circleBase.display();
	this.scene.rotate(Math.PI, 1, 0, 0);
	this.scene.translate(0, 0, this.height);
	this.circleTop.display();
};
