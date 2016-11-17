#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float divU;
uniform float divV;
uniform float seleU;
uniform float seleV;

varying vec2 vTextureCoord;


void main() {

	if((aTextureCoord.s >=(seleU/divU) &&  aTextureCoord.s <=(seleU+1.0)/divU) && 
		(aTextureCoord.t>=(seleV/divV) &&  aTextureCoord.t <=(seleV+1.0)/divV))
	  		 gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y , aVertexPosition.z+0.1, 1.0);
  else
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord= aTextureCoord;
}
