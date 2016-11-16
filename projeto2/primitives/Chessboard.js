/**
 * Chessboard
 * @constructor
 */
function Chessboard(scene,du, dv, su, sv){
	CGFobject.call(this, scene);


	this.initBuffers();
};

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.initBuffers = function () {

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Chessboard.prototype.display = function () {

};
