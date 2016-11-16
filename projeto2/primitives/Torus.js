/**
 * Torus
 * @constructor
 */
function Torus(scene, inner, outer, slices, loops) {
	CGFobject.call(this, scene);
	this.outer = outer;
	this.inner = inner;
	this.slices = slices;
	this.loops = loops;

	this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function () {
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	this.angle = Math.PI * 2 / this.slices;

	// generate vertices, normals and uvs
	for (j = 0; j <= this.loops; j++) {
		for (i = 0; i <= this.slices; i++) {
			var u = i / this.slices * Math.PI * 2;
			var v = j / this.loops * Math.PI * 2;
			// vertex
			var x = (this.outer + this.inner * Math.cos(v)) * Math.cos(u);
			var y = (this.outer + this.inner * Math.cos(v)) * Math.sin(u);
			var z = this.inner * Math.sin(v);
			this.vertices.push(x, y, z);
			// this vector is used to calculate the normal
			var a = [x, y, z];
			var b = [this.outer * Math.cos(u), this.outer * Math.sin(u), 1];
			var c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
			// normals
			this.normals.push(c[0], c[1], c[2]);
			// uv
			this.texCoords.push(i / this.slices, j / this.loops);
		}
	}

	// generate indices
	for (j = 1; j <= this.loops; j++) {
		for (i = 1; i <= this.slices; i++) {
			// indices
			var a = (this.slices + 1) * j + i - 1;
			var b = (this.slices + 1) * (j - 1) + i - 1;
			var c = (this.slices + 1) * (j - 1) + i;
			var d = (this.slices + 1) * j + i;
			// face one
			this.indices.push(a, b, d);
			// face two
			this.indices.push(b, c, d);
		}
	}

	for (j = 0; j <= this.loops; j++) {
		for (i = 1; i <= this.slices; i++) {
			var zangle = this.angle * i;
			var hangle = j * (Math.PI * 2) / this.loops;
			var r = 0.5;
			var x = (1 + Math.cos(hangle)) * Math.cos(zangle);
			var y = (1 + Math.cos(hangle)) * Math.sin(zangle);
			var z = Math.cos(hangle);
			//console.debug("x: %f y: %f z: %f\n", x, y, z);
			this.vertices.push(x, y, z);
			var currangle = this.angle * (i - 1) + this.angle / 2;
			var prevangle = this.angle * (i - 2) + this.angle / 2;
			this.normals.push(Math.cos(currangle) + Math.cos(prevangle), Math.sin(currangle) + Math.sin(prevangle), 0);
			var textCS = this.angle * i / (Math.PI * 2);
			var textCT = z;
			this.texCoords.push(textCS, textCT);
		}
	}

	//lados de fora
	for (j = 0; j < this.loops; j++) {
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
