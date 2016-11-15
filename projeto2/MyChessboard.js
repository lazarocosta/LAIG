/**
 * MyChessboard
 * @constructor
 */
function MyChessboard(scene,du, dv, su, sv){
	CGFobject.call(this, scene);


	this.initBuffers();
};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.initBuffers = function () {

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyChessboard.prototype.display = function () {

};
