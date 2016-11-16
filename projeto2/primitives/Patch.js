/**
* Patch
* @constructor
*/
function  Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {

    this.orderU = orderU;
    this.orderV = orderV;
    this.controlPoints = controlPoints;

    var points= new Array();

    for(var u=0; u <= this.orderU; u++){
        var pointsv= new Array();
        for(var v=0; v <= this.orderV; v++){
            var i= u*(this.orderU+1) + v;

            pointsv.push(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]);

            points.push(pointsv);
        }
    }

	Func = this.makeFunc(this.orderU, this.orderV, this.points);
	CGFnurbsObject.call(this,scene,Func,partsU,partsV);

};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.makeFunc = function (degree1, degree2, controlvertexes) {

	var knots1 = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
	var knots2 = this.getKnotsVector(degree2); // to be built inside webCGF in later versions

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	  return function(u, v) { 
		  return nurbsSurface.getPoint(u, v);
		};

}

Patch.prototype.getKnotsVector = function(deg) {
    var v = new Array();

    for (var i=0; i<=deg; i++) {
        v.push(0);
    }

    for (var i=0; i<=deg; i++) {
        v.push(1);
    }
    return v;
}
