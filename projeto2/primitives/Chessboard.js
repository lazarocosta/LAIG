/**
 * Chessboard
 * @constructor
 */
function Chessboard(scene,divU, divV, textureref, color1, color2, colorMark, seleU, seleV){
	CGFobject.call(this, scene);
	this.scene =scene;
	this.divU=divU;
	this.divV=divV;

this.plane = new Plane(scene, 1,1,this.divU,this.divV);

this.texture = this.scene.graph.textures[textureref].file;
this.shader = new CGFshader(this.scene.gl, "shaders/flat.vert", "shaders/flat.frag");


this.shader.setUniformsValues({
								 uSampler : 0,
                                  divU:parseInt(divU)*1.0,
								  divV:parseInt(divV)*1.0,
                                  seleU:parseInt(seleU)*1.0,
								  seleV:parseInt(seleV)*1.0,
								  color1:color1,
								  color2:color2,
								  colorMark:colorMark
								});



};
Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function () {

	this.texture.bind(0);
	 this.scene.setActiveShader(this.shader);
	this.plane.display();
	 this.scene.setActiveShader(this.scene.defaultShader);
};
