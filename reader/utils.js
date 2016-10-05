
var RGBA = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
  this.a = a;
}

var Point3D = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}


class Illumination {
  constructor(doublesided, local, ambient, background) {
	  
    this.doublesided = doublesided;
    this.local = local;
    this.ambient = ambient;
    this.background = background;
	}
}

class Material {
  constructor(id, emission, ambient, diffuse, specular, shininess) {

    this.id = id;
    this.emission = emission;
    this.ambient = ambient;
    this.diffuse = diffuse;
	  this.specular = specular;
	  this.shininess = shininess;
  }
} 

class Texture{
  constructor (id, file, length_s, length_t){

    this.id= id;
    this.file = file;
    this.length_s = length_s;
    this.length_t = length_t;
  }

}

class Perspective{
  constructor(id, near, far, angle, from, to){
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;
    this.from = from;
    this.to = to;
  }
}