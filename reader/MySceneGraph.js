
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;


	// File reading 
	this.reader = new CGFXMLreader();


	this.illumination;
	this.root;
	this.axisLength;
	this.views = [];
	this.omni = [];
	this.spot = [];
	this.textures = [];
	this.materials = [];
	this.transformations = [];
	this.primitives = [];
	this.component = [];


	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function () {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;




	// Here should go the calls for different functions to parse the various blocks
	console.log("Parse scene");
	this.parseScene(rootElement);

	console.log("Parse views");
	this.parseViews(rootElement);

	console.log("Parse illumination");
	var error = this.parseIllumination(rootElement);

	console.log("Parse lights");
	this.parseLights(rootElement);

	console.log("Parse textures");
	this.parseTextures(rootElement);

	console.log("Parse materials");
	this.parseMaterials(rootElement);

	console.log("Parse transformations");
	this.parseTransformations(rootElement);

	console.log("Parse primitives");
	this.parsePrimitives(rootElement);

	console.log("Parse components");
	this.parseComponents(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk = true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();


};


MySceneGraph.prototype.getRGBAElem = function (rootElement) {

	var r = this.reader.getFloat(rootElement, 'r');
	var g = this.reader.getFloat(rootElement, 'g');
	var b = this.reader.getFloat(rootElement, 'b');
	var a = this.reader.getFloat(rootElement, 'a');

	var rgba = new RGBA(r, g, b, a);

	//console.log(rgba);

	return rgba;
}

MySceneGraph.prototype.getPoint3D = function (rootElement) {

	var x = this.reader.getFloat(rootElement, 'x');
	var y = this.reader.getFloat(rootElement, 'y');
	var z = this.reader.getFloat(rootElement, 'z');

	var point = new Point3D(x, y, z)


	//console.log(point);

	return point;
}

MySceneGraph.prototype.parseScene = function (rootElement) {

	var scene = rootElement.getElementsByTagName('scene')[0];

	//console.log(scene);

	this.root = this.reader.getString(scene, 'root');
	this.axisLength = this.reader.getFloat(scene, 'axis_length');


	//console.log(this.root + "---axis:" + this.axisLength);
}

MySceneGraph.prototype.parseViews = function (rootElement) {


	//console.log("perspetives");
	var list = rootElement.getElementsByTagName('views');

	if (list == null)
		return "views element is missing.";

	if (list.length < 1)
		return "zero 'views' elements found.";

	var i = 0, id, near, far, angle, from, to, perspetive;

	for (i; i < list.length; i++) {
		perspetive = list[i].getElementsByTagName('perspective')[0];

		//console.log(perspetive);

		id = this.reader.getString(perspetive, 'id');
		near = this.reader.getFloat(perspetive, 'near');
		far = this.reader.getFloat(perspetive, 'far');
		angle = this.reader.getFloat(perspetive, 'angle');
		from = perspetive.getElementsByTagName('from')[0];
		to = perspetive.getElementsByTagName('to')[0];

		//	console.log(from);

		this.views[i] = new Perspective(id, near, far, angle, this.getPoint3D(from), this.getPoint3D(to));

		//	console.log(this.views[i]);
	}

}

MySceneGraph.prototype.parseIllumination = function (rootElement) {

	var illumi = rootElement.getElementsByTagName('illumination')[0];

	if (illumi == null)
		return "Illumination incomplete";

	var background = illumi.getElementsByTagName('background')[0];
	var ambient = illumi.getElementsByTagName('ambient')[0];
	var local = this.reader.getBoolean(illumi, 'local');
	var doublesided = this.reader.getBoolean(illumi, 'doublesided');

	this.illumination = new Illumination(doublesided, local, this.getRGBAElem(ambient), this.getRGBAElem(background));

	//console.log(this.illumination);
}

MySceneGraph.prototype.parseLights = function (rootElement) {

	var light, omni, spot;

	light = rootElement.getElementsByTagName("lights")[0];
	omni = light.getElementsByTagName("omni");
	spot = light.getElementsByTagName("spot");

	if (omni == null && spot == null)
		return "have not lights";

	//console.log(omni.length);

	var i, id, enabled, location, ambient, diffuse, specular, root;
	for (i = 0; i < omni.length; i++) {

		root = omni[i]

		id = this.reader.getString(root, 'id');
		enabled = this.reader.getBoolean(root, 'enabled');
		location = root.getElementsByTagName('location')[0];
		ambient = root.getElementsByTagName('ambient')[0];
		diffuse = root.getElementsByTagName('diffuse')[0];
		specular = root.getElementsByTagName('specular')[0];

		this.omni[i] = new Omni(id, enabled, this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));

		//console.log("omni");
		//console.log(this.omni[i]);
		//console.log(ambient);
	}

	var angle, exponent, target;
	for (i = 0; i < spot.length; i++) {

		//console.log("spot");
		root = spot[i];

		id = this.reader.getString(root, 'id');
		enabled = this.reader.getBoolean(root, 'enabled');
		angle = this.reader.getFloat(root, 'angle');
		exponent = this.reader.getFloat(root, 'exponent');
		target = root.getElementsByTagName('target')[0];
		location = root.getElementsByTagName('location')[0];
		ambient = root.getElementsByTagName('ambient')[0];
		diffuse = root.getElementsByTagName('diffuse')[0];
		specular = root.getElementsByTagName('specular')[0];

		this.spot[i] = new Spot(id, enabled, angle, exponent, this.getPoint3D(target), this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));

		//console.log(this.spot[i].diffuse);
		//console.log(this.spot[i].diffuse.g);
	}

	//	console.log( this.omni.length);

}

MySceneGraph.prototype.parseTextures = function (rootElement) {

	//console.log("textures");
	var root = rootElement.getElementsByTagName('textures')[0];

	if (root == 0)
		return "have not textures";

	var i = 0;
	var texture, id, file, length_s, length_t, length;
	length = root.getElementsByTagName('texture').length;

	for (i; i < length; i++) {

		texture = root.getElementsByTagName('texture')[i];

		id = this.reader.getString(texture, 'id');
		file = this.reader.getString(texture, 'file');
		length_s = this.reader.getString(texture, 'length_s');
		length_t = this.reader.getString(texture, 'length_t');

		this.textures[i] = new Texture(id, file, length_s, length_t);
		//console.log(this.textures[i]);
	}

}

MySceneGraph.prototype.parseMaterials = function (rootElement) {

	//console.log("materials");
	var x = rootElement.getElementsByTagName('materials')[0];

	var m1 = x.getElementsByTagName('material');


	if (m1 == null)
		return "have not materials"

	var i, materi, id, emission, ambient, diffuse, specular;

	for (i = 0; i < m1.length; i++) {
		materi = m1[i];
		id = this.reader.getString(materi, 'id');

		//console.log(materi);

		emission = materi.getElementsByTagName('emission')[0];
		ambient = materi.getElementsByTagName('ambient')[0];
		diffuse = materi.getElementsByTagName('diffuse')[0];
		specular = materi.getElementsByTagName('specular')[0];
		shininess = materi.getElementsByTagName('shininess')[0];


		this.materials[i] = new Material(id, this.getRGBAElem(emission),
			this.getRGBAElem(ambient),
		 								 this.getRGBAElem(diffuse),
		 								 this.getRGBAElem(specular),
		 								 this.reader.getFloat(shininess, 'value'));

		console.log(this.materials[i].diffuse.r);
	}

}

MySceneGraph.prototype.parseTransformations = function (rootElement) {

	var transformations = rootElement.getElementsByTagName('transformations');

	if (transformations == null)
		return "transformations element is missing.";

	if (transformations.length != 1)
		return "either zero or more than one 'transformations' element found.";

	var tl = transformations[0].children.length;

	if (tl < 1)
		return "zero transformations found";

	for (var i = 0; i < tl; i++) {
		var transformation = transformations[0].children[i];
		if (transformation.tagName != 'transformation') {
			console.error("Invalid tag name for supposed transformation nº " + i + ".");
			continue;
		}
		var id = transformation.id;
		console.log("Id: " + id);

		for (var j = 0; j < transformation.children.length; j++) {
			var tr = transformation.children[j];
			var type = tr.tagName;
			switch (type) {
				case 'translate':
					console.log("Translate");
					var tx = tr.attributes.getNamedItem('x').value;
					var ty = tr.attributes.getNamedItem('y').value;
					var tz = tr.attributes.getNamedItem('z').value;
					console.log("Tx: " + tx);
					console.log("Ty: " + ty);
					console.log("Tz: " + tz);
					break;
				case 'rotate':
					console.log("Rotate");
					var raxis = tr.attributes.getNamedItem('axis').value;
					var rangle = tr.attributes.getNamedItem('angle').value;
					console.log("Raxis: " + raxis);
					console.log("Rangle: " + rangle);
					break;
				case 'scale':
					console.log("Scale");
					var sx = tr.attributes.getNamedItem('x').value;
					var sy = tr.attributes.getNamedItem('y').value;
					var sz = tr.attributes.getNamedItem('z').value;
					console.log("Sx: " + sx);
					console.log("Sy: " + sy);
					console.log("Sz: " + sz);
					break;
				default:
					console.error("Unknown '" + type + "' transformation.");
					break;
			}
		}
	}

}

MySceneGraph.prototype.parsePrimitives = function (rootElement) {

	var primitives = rootElement.getElementsByTagName('primitives');

	if (primitives == null)
		return "primitives element is missing.";

	if (primitives.length != 1)
		return "zero or more than one 'primitives' element found.";

	var pl = primitives[0].children.length;

	if (pl < 1)
		return "zero primitives found";

	for (var i = 0; i < pl; i++) {
		var primi = primitives[0].children[i];
		var name = primi.tagName;
		if (name != 'primitive') {
			console.error("Invalid tag name for supposed primitive nº " + i + ".");
		}
		var id = primi.id;
		var object = primi.children[0];
		switch (object.tagName) {
			case 'rectangle':
				var x1 = object.attributes.getNamedItem('x1').value;
				var y1 = object.attributes.getNamedItem('y1').value;
				var x2 = object.attributes.getNamedItem('x2').value;
				var y2 = object.attributes.getNamedItem('y2').value;
				this.primitives.push(this.scene, new MyRectangle(x1, y1, x2, y2));
				break;
			case 'triangle':
				var x1 = object.attributes.getNamedItem('x1').value;
				var y1 = object.attributes.getNamedItem('y1').value;
				var z1 = object.attributes.getNamedItem('z1').value;
				var x2 = object.attributes.getNamedItem('x2').value;
				var y2 = object.attributes.getNamedItem('y2').value;
				var z2 = object.attributes.getNamedItem('z2').value;
				var x3 = object.attributes.getNamedItem('x3').value;
				var y3 = object.attributes.getNamedItem('y3').value;
				var z3 = object.attributes.getNamedItem('z3').value;
				this.primitives.push(this.scene, new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3));
				break;
			case 'cylinder':
				var base = object.attributes.getNamedItem('base').value;
				var top = object.attributes.getNamedItem('top').value;
				var height = object.attributes.getNamedItem('height').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var stacks = object.attributes.getNamedItem('stacks').value;
				this.primitives.push(this.scene, new MyCylinder());
				break;
			case 'sphere':
				var radius = object.attributes.getNamedItem('radius').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var stacks = object.attributes.getNamedItem('stacks').value;
				this.primitives.push(this.scene, new MySphere());
				break;
			case 'torus':
				var inner = object.attributes.getNamedItem('inner').value;
				var outer = object.attributes.getNamedItem('outer').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var loops = object.attributes.getNamedItem('loops').value;
				this.primitives.push(this.scene, new MyTorus(this.scene, inner, outer, slices, loops));
				break;
			default:
				console.error("You're just dumb, read the instructions you fuck (if you have no instructions then I am sorry - ty braga senpai for this)");
				break;
		}
	}
}

MySceneGraph.prototype.parseComponents = function (rootElement) {
	var components = rootElement.getElementsByTagName('components');
}

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);
	this.loadedOk = false;
};


