/**
* MyPlane
* @constructor
*/
function MyPlane(scene, uDivs, vDivs) {
	CGFobject.call(this, scene);

	this.plane = new CGFnurbsObject(scene, func, uDivs, vDivs )
	this.raio = raio;

};

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function(){
	this.plane.display();
}