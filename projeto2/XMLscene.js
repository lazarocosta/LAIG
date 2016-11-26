
function XMLscene(myInterface) {
    CGFscene.call(this);
    this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.setUpdatePeriod(1/120);

    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.axis = new CGFaxis(this);

    this.Index = 0;

    this.matIndex = 0;

    this.lightsId = {};
    this.lightsStatus = {};
    this.indexToId = [];

    this.currTime = -1;
    this.dTime = 0;
};

XMLscene.prototype.initGraph = function(graph) {
    this.graph = graph;
}

XMLscene.prototype.initLights = function() {

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
        var id = omni.id;
        this.lightsId[id] = this.lights[i];
        this.lightsStatus[id] = omni.enable;
        this.indexToId[i] = id;
        this.interface.addLight(id, 'omni');

        i++;
    }

    for (spot of this.graph.spot) {

        this.lights[i].setAmbient(spot.ambient.r, spot.ambient.g, spot.ambient.b, spot.ambient.a);
        this.lights[i].setDiffuse(spot.diffuse.r, spot.diffuse.g, spot.diffuse.b, spot.diffuse.a);
        this.lights[i].setSpecular(spot.specular.r, spot.specular.g, spot.specular.b, spot.specular.a);
        this.lights[i].setPosition(spot.location.x, spot.location.y, spot.location.z, 1);
        this.lights[i].setSpotExponent(spot.exponent);
        this.lights[i].setSpotDirection(spot.target.x, spot.target.y, spot.target.z);
        this.lights[i].setSpotDirection(spot.direction.x, spot.direction.y, spot.direction.z);

        this.lights[i].update();

        if (spot.enable) {
            this.lights[i].enable();
            this.lights[i].setVisible(true);
        }
        else {
            this.lights[i].disable();
            this.lights[i].setVisible(false);
        }
        var id = spot.id;
        this.lightsId[id] = this.lights[i];
        this.lightsStatus[id] = spot.enable;
        this.indexToId[i] = id;
        this.interface.addLight(id, 'spot');

        i++;
    }

};

XMLscene.prototype.updateLights = function() {

    for (var i = 0; i < this.lights.length; i++) {
        var j = this.indexToId[i];
        if (this.lightsStatus[j])
            this.lights[i].enable();
        else
            this.lights[i].disable();
    }

    for (light of this.lights)
        light.update();

}

XMLscene.prototype.changeMaterial = function() {
    this.matIndex++;
}

XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};


XMLscene.prototype.Cameras = function() {

    this.camera = this.graph.views[this.Index];
    this.interface.setActiveCamera(this.graph.views[this.Index]);

    this.Index = (++this.Index) % this.graph.views.length;
};

XMLscene.prototype.setDefaultAppearance = function() {
    this.setAmbient(0.4, 0.7, 0.7, 0.5);
    this.setDiffuse(0.4, 0.4, 0.7, 0.5);
    this.setSpecular(0.4, 0.4, 0.7, 0.5);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {

    var backgroundR = this.graph.illumination.background.r;
    var backgroundG = this.graph.illumination.background.g;
    var backgroundB = this.graph.illumination.background.b;
    var backgroundA = this.graph.illumination.background.a;

    this.gl.clearColor(backgroundR, backgroundG, backgroundB, backgroundA);

    //===================000

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    //=======================0
    this.axis = new CGFaxis(this, this.graph.axisLength, 0.1);

    this.initLights();
    //console.log(this.interface);
    this.Cameras();
    //this.graph.display();

    //this.graph.primitives[0]= new MyCylinder(this, 0, 1, 4, 30, 10);

};

XMLscene.prototype.display = function() {
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


        this.graph.display();

    };

    //var triangle = new Triangle(this, 0, 0, -2, -2, -2, -2, -2, 0, -2);
	/*var quadrado = new Rectangle(this, 3, 2, 2, 3);
	var torus = new Torus(this, 1, 2, 10, 10);
	var sphere = new Sphere(this, 10, 10, 0.7);*/

    //this.graph.primitives[0].display();
    // triangle.display();
    // quadrado.display();
    //torus.display();
	/*this.pushMatrix();
	this.translate(0, -5, 0);
	sphere.display();
	this.popMatrix();*/

	//var este =new Plane(this, 10, 10, 10, 10);
	//este.display();

    this.updateLights();

};

XMLscene.prototype.update = function(currTime){
    if(this.currTime != -1){
        this.dTime = currTime - this.currTime;
    }
    this.currTime = currTime;

    this.graph.update(this.dTime/1000);
}