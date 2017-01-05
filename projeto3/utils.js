var degToRad = Math.PI / 180;
var radToDeg = 1 / degToRad;

clone = function(array) {
    var newArray = [];
    var newObject;
    //console.debug(array);
    for (var i = 0; i < array.length; i++) {
        newObject = array[i].clone();
        newArray.push(newObject);
    }
    //console.debug(newArray);
    return newArray;
}

var RGBA = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    clone() {
        var newPoint = new Point3D(this.x, this.y, this.z);
        return newPoint;
    }
}

var Point2D = function(x, y) {
    this.x = x;
    this.y = y;
}

class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getx() {
        return this.x;
    }
    gety() {
        return this.y;
    }
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
    constructor(id, matrixTransformation, materialsId, textureId, componentref, primitiveref, inanimations) {
        this.id = id;
        this.matrixTransformation = matrixTransformation;
        this.materialsId = materialsId;
        this.textureId = textureId;
        this.componentref = componentref;
        this.primitiveref = primitiveref;
        this.animations = clone(inanimations);
        this.animationIndex = 0;
        this.currAnimation = this.animations[this.animationIndex];

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
            this.animationIndex++;
            this.currAnimation = this.animations[this.animationIndex];
        }
    }
    updateAnimation(dtime) {
        if (this.currAnimation != undefined) {
            this.currAnimation.update(dtime);
        }
    }
    getCurrentAnimation() {
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
        if (this.cTime >= this.time) {
            return true;
        }
        return false;
    }
}

class LinearAnimation extends Animation {
    constructor(time, points) {
        super(time);
        this.controlPoints = clone(points); //Has to be an array of Point3D
        this.currentPosition = this.controlPoints[0].clone();
        this.point = 1;
        this.dp = 0;
        for (var i = 0; i < this.controlPoints.length - 1; i++) {
            this.dp += this.distance(i);
        }
        this.v = this.dp / this.time;
        this.angles = [0, 0, 0];
        //this.timePerPoint = this.time / (this.controlPoints.length - 1);
        this.timePerPoint = this.timePoint();
        this.pTime = 0;
        this.ready = true;
    }
    nextPoint() {
        this.currentPosition = this.controlPoints[this.point].clone();
        this.point++;
        this.pTime = 0;
        this.timePerPoint = this.timePoint();
    }

    distance(indexPoint) {
        var distance = Math.sqrt(Math.pow(this.controlPoints[indexPoint + 1].x - this.controlPoints[indexPoint].x, 2) +
            Math.pow(this.controlPoints[indexPoint + 1].y - this.controlPoints[indexPoint].y, 2) +
            Math.pow(this.controlPoints[indexPoint + 1].z - this.controlPoints[indexPoint].z, 2));
        return distance;
    }

    timePoint() {
        var timePerPoint = this.distance(this.point - 1) / this.v;
        return timePerPoint;
    }

    update(time) {
        if (this.ready) {
            if (this.isOver()) {
                return;
            }
            if (this.pTime >= this.timePerPoint) {
                this.nextPoint();
            }
            var curr = this.currentPosition;
            var npoint = this.controlPoints[this.point];
            var vec = [npoint.x - curr.x, npoint.y - curr.y, npoint.z - curr.z];
            var norm = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
            //console.log(norm);
            //console.log(vec);
            var v = [(vec[0] / norm), (vec[1] / norm), (vec[2] / norm)];
            //console.debug(v);
            this.angles[0] = Math.acos(v[0]);
            this.angles[1] = Math.acos(v[1]);
            this.angles[2] = Math.acos(v[2]);
            var vx = this.v * v[0];
            var vy = this.v * v[1];
            var vz = this.v * v[2];
            //console.log(vx);
            //console.log(vy);
            //console.log(vz);

            this.currentPosition.x += vx * time;
            this.currentPosition.y += vy * time;
            this.currentPosition.z += vz * time;
            //console.debug(this);
            this.pTime += time;
            super.update(time);
        }
    }
    apply(scene) {
        scene.translate(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        scene.rotate(this.angles[1], 0, 1, 0);
        //console.debug(this.currentPosition);
    }
    clone() {
        var newAnimation = new LinearAnimation(this.time, this.controlPoints);
        return newAnimation;
    }
}

class CircularAnimation extends Animation {
    constructor(time, center, radius, iAngle, rAngle) {
        super(time);
        if (!(center instanceof Point3D)) {
            throw new TypeError("Center of circular animation must be of type Point3D");
        }
        this.center = center.clone(); //Center of the animation as Point3D
        this.radius = radius; //Radius of the animation as int
        this.iAngle = iAngle * degToRad; //Initial angle
        this.rAngle = rAngle * degToRad; //Rotation angle
        this.angle = this.iAngle;
        this.dAngle = this.rAngle / this.time;
        this.currentPosition = new Point3D(0, 0, 0);
        this.updatePosition();
        this.ready = true;
    }
    updatePosition() {
        this.currentPosition.x = this.center.x + this.radius * Math.sin(this.angle);
        this.currentPosition.y = this.center.y;
        this.currentPosition.z = this.center.z + this.radius * Math.cos(this.angle);
        //console.debug( this.center);
    }
    update(time) {
        if (this.ready) {
            if (this.isOver()) {
                //console.log('acabou');
                return;
            }
            this.angle += this.dAngle * time;
            this.updatePosition();
            super.update(time);
        }
    }
    apply(scene) {
        //console.debug(this.currentPosition);
        //scene.rotate(this.angle, 0, 1, 0);
        scene.translate(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        var angle = this.angle - Math.PI / 2;
        scene.rotate(angle, 0, 1, 0);

    }
    clone() {
        var time = this.time;
        var center = this.center;
        var radius = this.radius;
        var iAngle = this.iAngle * radToDeg;
        var rAngle = this.rAngle * radToDeg;
        var newAnimation = new CircularAnimation(time, center, radius, iAngle, rAngle);
        return newAnimation;
    }
}

class Played {
    constructor(piece, oldPosition, newX, newY) {
        this.piece = piece;
        this.oldPosition = oldPosition;
        this.newPosition = new Point2(newX, newY);
        var moveX = this.newPosition.x - this.oldPosition.x;
        var moveY = this.newPosition.y - this.oldPosition.y;
        this.moveVector = new Point2(moveX, moveY);
    }
}

function boardToString(board) {
    console.log(board);
    var boardString = "[";
    for (var i = 0; i < board.length; i++) {
        boardString += "[";
        for (var j = 0; j < board[i].length; j++) {
            boardString += board[i][j];
            if (j + 1 < board[i].length) {
                boardString += ","
            }
        }
        boardString += "]";
        if (i + 1 < board.length) {
            boardString += ","
        }
    }
    boardString += "]";
    console.log(boardString);
    return boardString;
}