
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
	constructor(id, matrixTransformation, materialsId, textureId, componentref, primitiveref, animations) {
		this.id = id;
		this.matrixTransformation = matrixTransformation;
		this.materialsId = materialsId;
		this.textureId = textureId;
		this.componentref = componentref;
		this.primitiveref = primitiveref;
		this.animations = animations.slice();
		this.animationIndex = 0;
		this.currAnimation = animations[0];
	}
	update(dtime) {
		if (this.currAnimation != undefined) {
			if (this.currAnimation.isOver()) {
				this.nextAnimation();
			}
			this.updateAnimation(dtime);
		}
	}
	nextAnimation() {
		if (this.animationIndex != this.animations.length - 1) {
			this.animationIndex += 1;
			this.currAnimation = this.animations[this.animationIndex];
		}
	}
	applyAnimation() {
		if (this.currAnimation != undefined) {
			this.currAnimation.apply();
		}
	}
	updateAnimation(dtime) {
		if (this.currAnimation != undefined) {
			this.currAnimation.update(dtime);
		}
	}
	getCurrentAnimation(){
		if (this.currAnimation != undefined) {
			return this.currAnimation;
		}
		return null;
	}
}

class Animation {
	constructor(time) {
		if (new.target === Animation) {
			throw new TypeError("Cannot construct Animation instances directly");
		}
		this.time = time; //Time of the animation
		this.cTime = 0; //Time this animation has been running for
	}
	update(time) {
		this.cTime += time;
	}
	isOver() {
		if (this.currentTime >= this.time) {
			return true;
		}
		return false;
	}
}

class LinearAnimation extends Animation {
	constructor(time, points) {
		super(time);
		this.controlPoints = points.slice(); //Has to be an array of Point3D
		this.currentPosition = points[0];
		this.point = 1;
		this.dp;
		for (var i = 0; i < this.controlPoints.length; i++) {
			this.dp += Math.sqrt(Math.pow(points[i].x, 2) + Math.pow(points[i].y, 2) + Math.pow(points[i].z, 2));
		}
		this.v = this.dp / this.controlPoints.length;
		this.angles = [0, 0, 0];
	}
	update(time) {
		if (this.isOver()) {
			return;
		} 
		if (this.currentPosition == this.controlPoints[this.point]) {
			this.point++;
		}
		var curr = this.currentPosition;
		var npoint = this.controlPoints[this.point];
		var vec = [npoint.x - curr.x, npoint.y - curr.y, npoint.z - curr.z];
		var norm = Math.sqrt(Math.pow(vec[0],2),Math.pow(vec[1],2),Math.pow(vec[2],2))
		this.angles[0] = Math.acos(vec[0] / norm);
		this.angles[1] = Math.acos(vec[1] / norm);
		this.angles[2] = Math.acos(vec[2] / norm);
		var vx = this.v * Math.cos(this.angles[0]);
		var vy = this.v * Math.cos(this.angles[1]);
		var vz = this.v * Math.cos(this.angles[2]);
		this.currentPosition.x += vx * time;
		this.currentPosition.y += vy * time;
		this.currentPosition.z += vz * time;
		super.update(time);
	}
	apply(scene) {
		scene.rotate(this.angles[0], 1, 0, 0);
		scene.rotate(this.angles[1], 0, 1, 0);
		scene.rotate(this.angles[2], 0, 0, 1);
		scene.translate(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
	}
	clone(){
		var newAnimation = new LinearAnimation(this.time,this.controlPoints);
		return newAnimation;
	}
}

class CircularAnimation extends Animation {
	constructor(time, center, radius, iAngle, rAngle) {
		super(time);
		if (!(center instanceof Point3D)) {
			throw new TypeError("Center of circular animation must be of type Point3D");
		}
		var degToRad = Math.PI / 180;
		this.center = center; //Center of the animation as Point3D
		this.radius = radius; //Radius of the animation as int
		this.iAngle = iAngle * degToRad; //Initial angle
		this.rAngle = rAngle * degToRad; //Rotation angle
		this.angle = this.iAngle;
		this.dAngle = this.rAngle / this.time;
		this.currentPosition = center;
	}
	update(time) {
		if (this.isOver()){
			return;
		}
		super.update(time);
	}
	apply(scene) {

	}
	clone(){
		var newAnimation = new CircularAnimation(this.time,this.center,this.radius,this.iAngle,this.rAngle);
		return newAnimation;
	}
}