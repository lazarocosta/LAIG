function XMLscene(myInterface) {
    CGFscene.call(this);
    this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.setUpdatePeriod(1 / 120);

    this.initCameras();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);
    this.setPickEnabled(true);

    this.axis = new CGFaxis(this);

    this.Index = 0;
    this.IndexOld = 0;

    this.matIndex = 0;

    this.lightsId = {};
    this.lightsStatus = {};
    this.indexToId = [];

    this.currTime = -1;
    this.dTime = 0;
    this.playingTime = 30;


    this.chageCamera = false;
    this.stepsCamera = 0;
    this.countStepsCamera = 0;
    this.difAngleCamera = 0;
    this.difNearCamera = 0;
    this.difFarCamera = 0;

    this.difPosiXCamera = 0;
    this.difPosiYCamera = 0;
    this.difPosiZCamera = 0;

    this.difTargXCamera = 0;
    this.difTargYCamera = 0;
    this.difTargZCamera = 0;

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
        } else {
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
        } else {
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

    //this.camera = this.graph.views[this.Index];
    //  this.interface.setActiveCamera(this.camera);
    //this.stepsCamera = 0;
    //this.countStepsCamera = 0;

    this.IndexOld = this.Index;
    this.Index = (++this.Index) % this.graph.views.length;

    if (this.IndexOld != this.Index) {
        this.chageCamera = true;
        this.stepsCamera = 0;
        console.debug('aqui');
        this.updateStepsCamera();

    }

};
XMLscene.prototype.updateStepsCamera = function() {
    var position1, position2;
    var target1, target2;

    position1 = this.graph.views[this.IndexOld].position;
    position2 = this.graph.views[this.Index].position;


    console.debug(position1);

    console.debug(position2);

    target1 = this.graph.views[this.IndexOld].target;
    target2 = this.graph.views[this.Index].target;

    this.difTargXCamera = target2[0] - target1[0];
    this.difTargYCamera = target2[1] - target1[1];
    this.difTargZCamera = target2[2] - target1[2];
    console.debug(this.difTargXCamera);
    console.debug(this.difTargYCamera);
    console.debug(this.difTargZCamera);

    this.difPosiXCamera = position2[0] - position1[0];
    this.difPosiYCamera = position2[1] - position1[1];
    this.difPosiZCamera = position2[2] - position1[2];
    console.debug(this.difPosiXCamera);
    console.debug(this.difPosiYCamera);
    console.debug(this.difPosiZCamera);


    var max = Math.max(Math.abs(this.difPosiXCamera), Math.abs(this.difPosiYCamera), Math.abs(this.difPosiZCamera),
        Math.abs(this.difTargXCamera), Math.abs(this.difTargYCamera), Math.abs(this.difTargZCamera));

    this.countStepsCamera = Math.ceil(max);


    this.difTargXCamera /= this.countStepsCamera;
    this.difTargYCamera /= this.countStepsCamera;
    this.difTargZCamera /= this.countStepsCamera;

    this.difPosiXCamera /= this.countStepsCamera;
    this.difPosiYCamera /= this.countStepsCamera;
    this.difPosiZCamera /= this.countStepsCamera;

    this.difAngleCamera = this.graph.views[this.Index].fov - this.graph.views[this.IndexOld].fov;
    this.difNearCamera = this.graph.views[this.Index].near - this.graph.views[this.IndexOld].near;
    this.difFarCamera = this.graph.views[this.Index].far - this.graph.views[this.IndexOld].far;

    this.difAngleCamera /= this.countStepsCamera;
    this.difNearCamera /= this.countStepsCamera;
    this.difFarCamera /= this.countStepsCamera;

    console.debug(this.difFarCamera);
    console.debug(this.difFarCamera);
    console.debug('fim');
};
XMLscene.prototype.moveCamera = function() {

    if (this.countStepsCamera > this.stepsCamera) {

        this.stepsCamera++;

        var positionOld = this.graph.views[this.IndexOld].position;

        var posX = this.difPosiXCamera * this.stepsCamera;
        var posY = this.difPosiYCamera * this.stepsCamera;
        var posZ = this.difPosiZCamera * this.stepsCamera;

        var position = vec3.fromValues(positionOld[0] + posX, positionOld[1] + posY, positionOld[2] + posZ);
        console.debug(position);


        var targetOld = this.graph.views[this.IndexOld].target;
        var targetX = this.difTargXCamera * this.stepsCamera;
        var targetY = this.difTargYCamera * this.stepsCamera;
        var targetZ = this.difTargZCamera * this.stepsCamera;


        var target = vec3.fromValues(targetOld[0] + targetX, targetOld[1] + targetY, targetOld[2] + targetZ);
        //  console.debug(target);

        var angleOld = this.graph.views[this.IndexOld].fov;
        var angle = angleOld + this.difAngleCamera * this.stepsCamera;


        var nearOld = this.graph.views[this.IndexOld].near;
        //console.debug(nearOld);
        var near = nearOld + this.difNearCamera * this.stepsCamera;


        var farOld = this.graph.views[this.IndexOld].far;
        var far = farOld + this.difFarCamera * this.stepsCamera;

        var novo = angle * radToDeg;
        console.debug(novo);



        //this.camera = new CGFcamera(angle, near, far, position, target);
        this.camera = new CGFcamera(angle, near, far, position, target);

        this.interface.setActiveCamera(this.camera);
    } else
        this.chageCamera = false;
}


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
    this.camera = this.graph.views[this.Index];
    this.interface.setActiveCamera(this.camera);

};

XMLscene.prototype.logPicking = function() {
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {

                var obj = this.pickResults[i][0];
                if (obj) {
                    obj.select();
                    //var customId = this.pickResults[i][1];
                    // console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
}

XMLscene.prototype.display = function() {


    this.logPicking();
    this.clearPickRegistration();


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
    this.updateLights();

};

XMLscene.prototype.update = function(currTime) {
    if (this.currTime != -1) {
        this.dTime = currTime - this.currTime;
    }
    this.currTime = currTime;

    this.graph.update(this.dTime / 1000);

    if (this.chageCamera) {
        this.moveCamera();

    }
}