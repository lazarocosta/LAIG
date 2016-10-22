/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function (application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	this.gui = new dat.GUI();
	this.omni = [];
	this.spot = [];

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };

	//this.gui.add(this.scene, 'UpdateTime');

	// add a group of controls (and open/expand by defult)
	//var ligths = this.gui.addFolder("Ligths");
	var omni = this.gui.addFolder("Omni");

	var spot = this.gui.addFolder("Spot");

	return true;
};

MyInterface.prototype.addLight = function (id, type) {
	switch (type) {
		case 'Omni':
			this.omni.add(this.lightClicked(id),id);
			break;
		case 'Spot':
			break;
		default:
			break;
	}
}

MyInterface.prototype.lightClicked = function (id) {
	
}

/**
 * processKeyUp
 * @param event {Event}
 */
/*MyInterface.prototype.processKeyUp = function(event) {
   // call CGFinterface default code (omit if you want to override)
   CGFinterface.prototype.processKeyUp.call(this, event);
	this.scene.currentDIR = this.scene.DIRECTION.STATIC;
};*/


/**
 * processKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function (event) {
	// call CGFinterface default code (omit if you want to override)
	// CGFinterface.prototype.processKeyboard.call(this, event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp


	switch (event.keyCode) {
		case (86): //letra v
		case (118): //letra V
			//   console.log("letra V");
			this.scene.Cameras();
			break;

	};
}