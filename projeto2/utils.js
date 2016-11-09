
var RGBA = function (r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

var Point3D = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

var Point2D = function (x, y) {
  this.x = x;
  this.y = y;
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

class Texture {
  constructor(id, file, length_s, length_t) {
    this.id = id;
    this.file = file;
    this.length_s = length_s;
    this.length_t = length_t;
  }

}

class Perspective {
  constructor(id, near, far, angle, from, to) {
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;
    this.from = from;
    this.to = to;
  }
}

class Omni {
  constructor(id, enable, location, ambient, diffuse, specular) {
    this.id = id;
    this.enable = enable;
    this.location = location;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;

  }
}

class Spot {
  constructor(id, enable, angle, exponent, target, location, ambient, diffuse, specular) {
    this.id = id;
    this.enable = enable;
    this.angle = angle;
    this.exponent = exponent;
    this.target = target;
    this.location = location;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.direction = new Point3D(target.x - location.x, target.y - location.y, target.z - location.z);

  }
}

class Component {
  constructor(id, matrixTransformation, materialsId, textureId, componentref, primitiveref) {
    this.id = id;
    this.matrixTransformation = matrixTransformation;
    this.materialsId = materialsId;
    this.textureId = textureId;
    this.componentref = componentref;
    this.primitiveref = primitiveref;
  }

}

class Animation {
  constructor(time) {
    if (new.target === Animation) {
      throw new TypeError("Cannot construct Animation instances directly");
    }
    this.time = time; //Time of the animation
  }
}

class LinearAnimation extends Animation {
  constructor(time,points){
    super(time);
    this.controlPoints = points; //Has to be an array
  }
}

class CircularAnimation extends Animation {
  constructor(time,center,radius,iAngle,rAngle){
    super(time);
    if (!(center instanceof Point3D)){
      throw new TypeError("Center of circular animation must be of type Point3D");
    }
    this.center = center; //Center of the animation as Point3D
    this.radius = radius; //Radius of the animation as int
    this.iAngle = iAngle; //Initial angle
    this.rAngle = rAngle; //Rotation angle
  }
}