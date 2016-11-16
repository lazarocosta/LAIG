/**
* Plane
* @constructor
*/
function Plane(scene, dimX, dimY, partsX, partsY) {

    this.scene = scene;
    this.dimX = dimX;
    this.dimY = dimY;
    this.partsX = partsX;
	this.partsY = partsY;

	    Func = this.makeFunc(1, // degree on U: 2 control vertexes U
                 1, // degree on V: 2 control vertexes on V
                [	// U = 0
                    [ // V = 0..1;
                         [-(dimX/2), -(dimY/2), 0.0, 1 ],
                         [-(dimX/2), (dimY/2), 0.0, 1 ]
                    ],
                    // U = 1
                    [ // V = 0..1
                         [ (dimX/2), -(dimY/2), 0.0, 1 ],
                         [ (dimX/2),  (dimY/2), 0.0, 1 ]
                    ]
				]);
	this.plane = new CGFnurbsObject(this, Func, partsX, partsY);
	CGFnurbsObject.call(this,scene,Func,partsX,partsY);
};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.makeFunc = function (degree1, degree2, controlvertexes) {

	var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	  return function(u, v) { 
		  return nurbsSurface.getPoint(u, v);
		};

}

Plane.prototype.getKnotsVector = function(deg) {
    var v = new Array();

    for (var i=0; i<=deg; i++) {
        v.push(0);
    }

    for (var i=0; i<=deg; i++) {
        v.push(1);
    }
    return v;
}

Plane.prototype.display = function(){
	this.plane.display();
}
