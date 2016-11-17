#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform vec4 color1;
uniform vec4 color2;
uniform vec4 colorMark;

uniform float divU;
uniform float divV;
uniform float seleU;
uniform float seleV;
uniform sampler2D uSampler;

void main() {
	vec4 colorTexture = texture2D(uSampler, vTextureCoord);

 float posX = floor(divU*vTextureCoord.s);
 float posY = floor(divV*vTextureCoord.t);

			if((vTextureCoord.s >=(seleU/divU) &&  vTextureCoord.s <=(seleU+1.0)/divU) && 
			(vTextureCoord.t >=(seleV/divV) &&  vTextureCoord.t <=(seleV+1.0)/divV))
				gl_FragColor = colorTexture * colorMark;
			else
			if(mod((posX+posY),2.0) == 0.0)
				gl_FragColor =  colorTexture * color1;
			else
				gl_FragColor =  colorTexture * 	color2;
}
