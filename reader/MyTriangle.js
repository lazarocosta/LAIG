/**
 * MyTriangle
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, minS, maxS, minT, maxT) {
    CGFobject.call(this, scene);

    this.minS = minS || 0;
    this.minT = minT || 0;
    this.maxS = maxS || 1;
    this.maxT = maxT || 1;

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function () {
    this.vertices = [
        x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3
    ];

    this.indices = [
        0, 1, 2
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [
        
    ]

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
