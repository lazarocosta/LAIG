/**
 * Chessboard
 * @constructor
 */
function Chessboard(scene,divU, divV, textureref, color1, color2, colorMark, seleU, seleV){
	CGFobject.call(this, scene);
	this.scene =scene;
	this.divU=divU;
	this.divV=divV;
	this.seleU = seleU;
	this.seleV = seleV;

	this.plane = new Plane(scene, 1,1,this.divU*16,this.divV*16);

	this.texture = this.scene.graph.textures[textureref].file;
	this.shader = new CGFshader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag");

	this.shader.setUniformsValues({
									uSampler : 0,
									divU:this.divU*1.0,
									divV:this.divV*1.0,
									seleU:this.seleU*1.0,
									seleV:this.seleV*1.0,
									color1:color1,
									color2:color2,
									colorMark:colorMark
									});
};

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.updateMark = function (){
	this.seleU++;
	this.seleU %= this.divU;

	if(this.seleU == 0)
		this.seleV++;

	if(this.seleV == this.divV)
		this.seleV=0;
}

Chessboard.prototype.display = function () {

	this.shader.setUniformsValues({ 
								  seleU:this.seleU*1.0,
								  seleV:this.seleV*1.0
								  });
	this.texture.bind(0);
	 this.scene.setActiveShader(this.shader);
	this.plane.display();
	 this.scene.setActiveShader(this.scene.defaultShader);
};
