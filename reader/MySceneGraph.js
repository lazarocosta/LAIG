
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

		
	// File reading 
	this.reader = new CGFXMLreader();


	this.illumination;
	this.root;
	this.axisLength;
	this.views = {};
	this.omni = {};
	this.spot = {};
	this.textures = {};
	this.materials = {};
	this.transformations = {};
	this.primitives = {};
	this.component = {};


	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;



	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseIllumination(rootElement);
	this.parseTextures(rootElement);
	this.parseViews(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();


};


MySceneGraph.prototype.getRGBAElem = function(rootElement) {

	var r = this.reader.getFloat(rootElement,'r');
	var g = this.reader.getFloat(rootElement,'g');
	var b = this.reader.getFloat(rootElement,'b');
	var a = this.reader.getFloat(rootElement,'a');
	
	var rgba = new RGBA(r,g,b,a);

	console.log(rootElement);
	console.log(rgba);

	return rgba;
}

MySceneGraph.prototype.getPoint3D = function(rootElement) {

	var x = this.reader.getFloat(rootElement,'x');
	var y = this.reader.getFloat(rootElement,'y');
	var z = this.reader.getFloat(rootElement,'z');
	
	var point = new Point3D(x, y, z)

	
	console.log(rootElement);
	console.log(point);

	return point;
}

MySceneGraph.prototype.parseIllumination= function(rootElement) {

	var illumi = rootElement.getElementsByTagName('illumination')[0];

	if(illumi == null )
	return "Illumination incomplete";

	var background = illumi.getElementsByTagName('background')[0];
	var ambient = illumi.getElementsByTagName('ambient')[0];
	var local = this.reader.getBoolean(illumi,'local');
	var doublesided = this.reader.getBoolean(illumi,'doublesided');

	this.illumination= new Illumination(doublesided, local, this.getRGBAElem(ambient), this.getRGBAElem(background));

	console.log(this.illumination);
}

MySceneGraph.prototype.parseScene= function(rootElement){

	var scene = rootElement.getElementsByTagName('scene')[0];
	
	console.log(scene);

	this.root = this.reader.getString(scene,'root');
	this.axisLength = this.reader.getFloat(scene,'axis_length');


	console.log(this.root + "---axis:"+ this.axisLength);
}

MySceneGraph.prototype.parseTextures= function(rootElement){

	console.log("textures");
	var length = rootElement.getElementsByTagName('textures').length;

	if(length == 0)
	return "is have not textures";

	var i=0;
	var texture, id, file, length_s, length_t;

	for(i; i < length; i++)
	{
		texture = rootElement.getElementsByTagName('texture')[i];

		console.log(texture);

		id= this.reader.getString(texture,'id');
		file = this.reader.getString(texture,'file');
		length_s =this.reader.getString(texture,'length_s');
		length_t = this.reader.getString(texture,'length_t');

		this.textures[i] = new Texture(id, file, length_s, length_t);
		console.log(this.textures[i]);
}

}

MySceneGraph.prototype.parseViews= function(rootElement){


	console.log("perspetives");
	var list = rootElement.getElementsByTagName('views');

	if(list==null)
	return "is have not views";

	var i=0, id, near, far, angle, from, to, perspetive;

	for(i; i < list.length; i++)
	{
		perspetive = list[i].getElementsByTagName('perspective')[0];
		
		console.log(perspetive);
		
		id = this.reader.getString(perspetive, 'id');
		near = this.reader.getFloat(perspetive, 'near');
		far = this.reader.getFloat(perspetive, 'far');
		angle = this.reader.getFloat(perspetive, 'angle');
		from = perspetive.getElementsByTagName('from')[0];
		to = perspetive.getElementsByTagName('to')[0];

		console.log(from);

		this.views[i]= new Perspective(id, near, far, angle, this.getPoint3D(from), this.getPoint3D(to));

		console.log(this.views[i]);
	}


}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	//this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	//this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	//this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};
	

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+ message);	
	this.loadedOk=false;
};


