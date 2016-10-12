
function XMLscene(myInterface) {
    CGFscene.call(this);
	this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);

	this.Index=0;
};

XMLscene.prototype.initLights = function () {

	var i = 0;
	for (omni of this.graph.omni) {

		this.lights[i].setAmbient(omni.ambient.r, omni.ambient.g, omni.ambient.b, omni.ambient.a);
		this.lights[i].setDiffuse(omni.diffuse.r, omni.diffuse.g, omni.diffuse.b, omni.diffuse.a);
		this.lights[i].setSpecular(omni.specular.r, omni.specular.g, omni.specular.b, omni.specular.a);
		this.lights[i].setPosition(omni.location.x, omni.location.y, omni.location.z, 0);
		this.lights[i].update();

		if (omni.enable) {
			this.lights[i].enable();
			this.lights[i].setVisible(true);
		}
		else {
			this.lights[i].disable();
			this.lights[i].setVisible(false);
		}

		i++;
	}

	for (spot of this.graph.spot) {

		this.lights[i].setAmbient(spot.ambient.r, spot.ambient.g, spot.ambient.b, spot.ambient.a);
		this.lights[i].setDiffuse(spot.diffuse.r, spot.diffuse.g, spot.diffuse.b, spot.diffuse.a);
		this.lights[i].setSpecular(spot.specular.r, spot.specular.g, spot.specular.b, spot.specular.a);
		this.lights[i].setPosition(spot.location.x, spot.location.y, spot.location.z, 1);
		this.lights[i].setSpotExponent(spot.exponent);
		this.lights[i].setSpotDirection(spot.target.x, spot.target.y, spot.target.z);

		this.lights[i].update();

		if (spot.enable) {
			this.lights[i].enable();
			this.lights[i].setVisible(true);
		}
		else {
			this.lights[i].disable();
			this.lights[i].setVisible(false);
		}

		i++;
	}

};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/*
XMLscene.prototype.Cameras = function () {

	var cameraGraph = this.graph.views[this.Index];
    this.camera = cameraGraph;
	this.interface.setActivateCamera(cameraGraph);

	 this.Index = (this.Index ++) % this.graph.views.length;
};
*/

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {

	var backgroundR = this.graph.illumination.background.r;
	var backgroundG = this.graph.illumination.background.g;
	var backgroundB = this.graph.illumination.background.b;
	var backgroundA = this.graph.illumination.background.a;

	this.gl.clearColor(backgroundR, backgroundG, backgroundB, backgroundA);

	this.axis = new CGFaxis(this, this.graph.axisLength, 0.1);

	this.initLights();
	//this.cameras();



};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {

		for (light of this.lights)
			light.update();
	};



};

