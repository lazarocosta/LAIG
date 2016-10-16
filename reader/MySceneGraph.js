
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
	var error = null;

	// Here should go the calls for different functions to parse the various blocks

	error = this.parse(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk = true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();


};


MySceneGraph.prototype.parse = function (rootElement) {
	var check = {};
	check['scene'] = false;
	check['views'] = false;
	check['lights'] = false;
	check['illumination'] = false;
	check['lights'] = false;
	check['textures'] = false;
	check['materials'] = false;
	check['transformations'] = false;
	check['primitives'] = false;
	check['components'] = false;
	var n = rootElement.children.length;
	for (var i = 0; i < n; i++) {
		var element = rootElement.children[i];
		var name = element.tagName;
		console.log(name);
		if (check[name]) {
			return "more than one '" + name + "' element found";
		} else {
			check[name] = true;
		}
		switch (name) {
			case 'scene':
				console.log("Parse scene");
				this.parseScene(element);
				break;
			case 'views':
				console.log("Parse");
				this.parseViews(element);
				break;
			case 'illumination':
				console.log("Parse");
				this.parseIllumination(element);
				break;
			case 'lights':
				console.log("Parse");
				this.parseLights(element);
				break;
			case 'textures':
				console.log("Parse");
				this.parseTextures(element);
				break;
			case 'materials':
				console.log("Parse");
				this.parseMaterials(element);
				break;
			case 'transformations':
				console.log("Parse");
				this.parseTransformations(element);
				break;
			case 'primitives':
				console.log("Parse");
				this.parsePrimitives(element);
				break;
			case 'components':
				console.log("Parse");
				this.parseComponents(element);
				break;
			default:
				check[name] = false;
				console.warn("ignoring '" + name + "' since it's not a valid element");
				break;
		}
	}

};

MySceneGraph.prototype.getRGBAElem = function (rootElement) {

	var r = this.reader.getFloat(rootElement, 'r');
	var g = this.reader.getFloat(rootElement, 'g');
	var b = this.reader.getFloat(rootElement, 'b');
	var a = this.reader.getFloat(rootElement, 'a');

	var rgba = new RGBA(r, g, b, a);

	//console.log(rgba);

	return rgba;
};

MySceneGraph.prototype.getPoint3D = function (rootElement) {

	var x = this.reader.getFloat(rootElement, 'x');
	var y = this.reader.getFloat(rootElement, 'y');
	var z = this.reader.getFloat(rootElement, 'z');

	var point = new Point3D(x, y, z)


	//console.log(point);

	return point;
};

MySceneGraph.prototype.parseScene = function (element) {

	//console.log(element);
	this.root = this.reader.getString(element, 'root');
	this.axisLength = this.reader.getFloat(element, 'axis_length');


	//console.log(this.root + "---axis:" + this.axisLength);
};

MySceneGraph.prototype.parseViews = function (element) {
	var perspectives = element.children;
	var pl = perspectives.length;
	for (var i = 0; i < pl; i++) {
		var perspective = perspectives[i];
		var name = perspective.tagName;

		//console.log(perspetive);

		var id = this.reader.getString(perspective, 'id');
		var near = this.reader.getFloat(perspective, 'near');
		var far = this.reader.getFloat(perspective, 'far');
		var angle = this.reader.getFloat(perspective, 'angle');
		var from = perspective.getElementsByTagName('from')[0];
		var to = perspective.getElementsByTagName('to')[0];

		//	console.log(from);
		var fromPoint = this.getPoint3D(from);
		var toPoint = this.getPoint3D(to);
		this.views[i] = new CGFcamera(angle, near, far, vec3.fromValues(fromPoint.x, fromPoint.y, fromPoint.z), vec3.fromValues(toPoint.x, toPoint.y, toPoint.z));

		//this.views[i] = new Perspective(id, near, far, angle, this.getPoint3D(from), this.getPoint3D(to));

		//	console.log(this.views[i]);
	}

};

MySceneGraph.prototype.parseIllumination = function (element) {

	var illumi = element;

	if (illumi == null)
		return "Illumination incomplete";

	var background = illumi.getElementsByTagName('background')[0];
	var ambient = illumi.getElementsByTagName('ambient')[0];
	var local = this.reader.getBoolean(illumi, 'local');
	var doublesided = this.reader.getBoolean(illumi, 'doublesided');

	this.illumination = new Illumination(doublesided, local, this.getRGBAElem(ambient), this.getRGBAElem(background));

	//console.log(this.illumination);
};

MySceneGraph.prototype.parseLights = function (element) {

	var light, omni, spot;

	light = element;
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

};

MySceneGraph.prototype.parseTextures = function (element) {

	var textures = element.children;
	var tl = textures.length;

	if (tl < 1)
		return "no textures were found";

	for (var i = 0; i < tl; i++) {
		var texture = textures[i];
		if (texture.tagName != 'texture') {
			console.warn("");
			continue;
		}
		var id = texture.id;
		var file = this.reader.getString(texture, 'file');
		var length_s = this.reader.getString(texture, 'length_s');
		var length_t = this.reader.getString(texture, 'length_t');
		this.textures[i] = new Texture(id, file, length_s, length_t);
	}

};

MySceneGraph.prototype.parseMaterials = function (element) {

	var materials = element;
	var ms = materials.children;
	var ml = ms.length;

	if (ml < 1)
		return "zero materials found";

	for (var i = 0; i < ml; i++) {
		if (ms[i].tagName != 'material') {
			console.warn("Invalid tag name for supposed material!");
			continue;
		}
		var mspecs = ms[i].children;
		var msl = mspecs.length;
		var check = {};
		check['emission'] = false;
		check['ambient'] = false;
		check['diffuse'] = false;
		check['specular'] = false;
		check['shininess'] = false;
		for (var j = 0; j < msl; j++) {
			var name = mspecs[j].tagName;
			if (check[name]) {
				console.warn("More than one '" + name + "' element found!");
				continue;
			} else {
				check[name] = true;
			}
			switch (name) {
				case 'emission':

					break;
				case 'ambient':

					break;
				case 'diffuse':

					break;
				case 'specular':

					break;
				case 'shininess':

					break;
				default:
					check[name] = false;
					console.error("'" + name + "' is not an element of material!");
					break;
			}
		}
	}

	/*var i, materi, id, emission, ambient, diffuse, specular;

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
	}*/

};

MySceneGraph.prototype.parseTransformations = function (element) {

	var matrix = mat4.create();

	var transformations = element;
	var ts = transformations.children;
	var tl = ts.length;

	if (tl < 1)
		return "zero transformations found";

	for (var i = 0; i < tl; i++) {
		var transformation = ts[i];
		if (transformation.tagName != 'transformation') {
			console.warn("Invalid tag name for supposed transformation nº " + i + ".");
			continue;
		}
		var id = transformation.id, point3d;
		console.log("Id: " + id);

		for (var j = 0; j < transformation.children.length; j++) {
			var tr = transformation.children[j];
			var type = tr.tagName;
			switch (type) {
				case 'translate':
					console.log("Translate");
					point3d = this.getPoint3D(tr);
					mat4.translate(matrix, matrix, [point3d.x, point3d.y, point3d.z]);
					console.log("Tx: " + point3d.x);
					console.log("Ty: " + point3d.y);
					console.log("Tz: " + point3d.z);
					break;
				case 'rotate':
					console.log("Rotate");
					var raxis = tr.attributes.getNamedItem('axis').value;
					var rangle = tr.attributes.getNamedItem('angle').value;
					var axis;
					switch (raxis) {
						case 'x':
							axis = [1, 0, 0];
							break;
						case 'y':
							axis = [0, 1, 0];
							break;
						case 'z':
							axis = [0, 0, 1];
							break;
						default:
							return "'" + raxis + "' is not a valid axis for a rotation";
					}
					mat4.rotate(matrix, matrix, rangle, axis);
					console.log("Raxis: " + raxis);
					console.log("Rangle: " + rangle);
					break;
				case 'scale':
					console.log("Scale");
					point3d = this.getPoint3D(tr);
					mat4.scale(matrix, matrix, [point3d.x, point3d.y, point3d.z]);
					console.log("Sx: " + point3d.x);
					console.log("Sy: " + point3d.y);
					console.log("Sz: " + point3d.z);
					break;
				default:
					console.error("Unknown '" + type + "' transformation.");
					break;
			}
		}
		this.transformations.push(matrix);
	}

};

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
				this.primitives.push(this.scene, new MyRectangle(this.scene, x1, y1, x2, y2));
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
				//this.primitives.push(this.scene, new MyCylinder());
				break;
			case 'sphere':
				var radius = object.attributes.getNamedItem('radius').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var stacks = object.attributes.getNamedItem('stacks').value;
				//this.primitives.push(this.scene, new MySphere());
				break;
			case 'torus':
				var inner = object.attributes.getNamedItem('inner').value;
				var outer = object.attributes.getNamedItem('outer').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var loops = object.attributes.getNamedItem('loops').value;
				//this.primitives.push(this.scene, new MyTorus(this.scene, inner, outer, slices, loops));
				break;
			default:
				console.error("You're just dumb, read the instructions you fuck (if you have no instructions then I am sorry - ty braga senpai for this)");
				break;
		}
	}
};

MySceneGraph.prototype.parseComponents = function (element) {
	var components = element.children;
	var cl = components.length;
	for (var i = 0; i < cl; i++) {

	}
};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);
	this.loadedOk = false;
};


