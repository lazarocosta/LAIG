
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
		//angle = angle* Math.PI / 180;
		var from = perspective.getElementsByTagName('from')[0];
		var to = perspective.getElementsByTagName('to')[0];

		//	console.log(from);
		var fromPoint = this.getPoint3D(from);
		var toPoint = this.getPoint3D(to);
		this.views[i] = new CGFcamera(angle, near, far, vec3.fromValues(fromPoint.x, fromPoint.y, fromPoint.z), vec3.fromValues(toPoint.x, toPoint.y, toPoint.z));

		//this.views[i] = new Perspective(id, near, far, angle, this.getPoint3D(from), this.getPoint3D(to));

		console.log(this.views[i]);
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


};

MySceneGraph.prototype.parseLights = function (element) {

	var light = element, omni, spot;

	omni = light.getElementsByTagName('omni');
	spot = light.getElementsByTagName('spot');

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
		//	angle = angle * Math.PI / 180;
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

	//console.log("textures");
	var root = element;

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

};

MySceneGraph.prototype.parseMaterials = function (element) {

	var materials = element

	for (var i = 0; i < materials.length; i++) {
		console.log(materials[i]);
	}

	/*if (materials == null)
		return "materials element is missing";

	if (materials.length != 1)
		return "either zero or more than one 'materials' element found";*/

	var ms = materials.children;
	var ml = ms.length;

	//console.log(ms[0]);
	//console.log("-------------------");

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
			switch (name) {
				case 'emission':
					if (check[name]) {
						console.error("More than one '" + name + "' element found!");
					} else {

						check[name] = true;
					}
					break;
				case 'ambient':
					if (check[name]) {
						console.error("More than one '" + name + "' element found!");
					} else {

						check[name] = true;
					}
					break;
				case 'diffuse':
					if (check[name]) {
						console.error("More than one '" + name + "' element found!");
					} else {

						check[name] = true;
					}
					break;
				case 'specular':
					if (check[name]) {
						console.error("More than one '" + name + "' element found!");
					} else {

						check[name] = true;
					}
					break;
				case 'shininess':
					if (check[name]) {
						console.error("More than one '" + name + "' element found!");
					} else {

						check[name] = true;
					}
					break;
				default:
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

	var transformations = element.getElementsByTagName('transformations');

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
			console.warn("Invalid tag name for supposed transformation nº " + i + ".");
			continue;
		}
		var id = transformation.id, point3d;
		console.log("Id: " + id);

		matrix = this.readTransformation(transformation);
		this.transformations[id] = matrix;
	}

};

MySceneGraph.prototype.parsePrimitives = function (element) {

	var primitives = element.getElementsByTagName('primitives');

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
				this.primitives[id] = new new MyRectangle(this.scene, x1, y1, x2, y2);
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
				//this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;
			case 'cylinder':
				var base = object.attributes.getNamedItem('base').value;
				var top = object.attributes.getNamedItem('top').value;
				var height = object.attributes.getNamedItem('height').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var stacks = object.attributes.getNamedItem('stacks').value;
				//this.primitives[id] = new  MyCylinder();
				break;
			case 'sphere':
				var radius = object.attributes.getNamedItem('radius').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var stacks = object.attributes.getNamedItem('stacks').value;
				//this.primitives[id] = new  MySphere();
				break;
			case 'torus':
				var inner = object.attributes.getNamedItem('inner').value;
				var outer = object.attributes.getNamedItem('outer').value;
				var slices = object.attributes.getNamedItem('slices').value;
				var loops = object.attributes.getNamedItem('loops').value;
				//this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
				break;
			default:
				console.error("You're just dumb, read the instructions you fuck (if you have no instructions then I am sorry - ty braga senpai for this)");
				break;
		}
	}
};

MySceneGraph.prototype.readTransformation = function (element) {
	var transformation = element;
	var matrix = mat4.create();


	//console.log(element);
	for (var j = transformation.children.length - 1; j > 0; j--) {
		var tr = transformation.children[j];
		//console.log(transformation.children[j]);
		var type = tr.tagName;
		switch (type) {
			case 'translate':
				//	console.log("Translate");
				point3d = this.getPoint3D(tr);
				mat4.translate(matrix, matrix, [point3d.x, point3d.y, point3d.z]);

				/*console.log("Tx: " + point3d.x);
				console.log("Ty: " + point3d.y);
				console.log("Tz: " + point3d.z);*/

				break;
			case 'rotate':
				//console.log("Rotate");
				var raxis = tr.attributes.getNamedItem('axis').value;
				var rangle = tr.attributes.getNamedItem('angle').value;
				rangle = rangle * Math.PI / 180;

				if (raxis == "x")
					mat4.rotate(matrix, matrix, rangle, [1, 0, 0]);
				else if (raxis == "y")
					mat4.rotate(matrix, matrix, rangle, [0, 1, 0]);
				else if (raxis == "z")
					mat4.rotate(matrix, matrix, rangle, [0, 0, 1]);

				//console.log("Raxis: " + raxis);
				//console.log("Rangle: " + rangle);

				break;
			case 'scale':
				//console.log("Scale");

				point3d = this.getPoint3D(tr);
				mat4.scale(matrix, matrix, [point3d.x, point3d.y, point3d.z]);

				/*	console.log("Tx: " + point3d.x);
					console.log("Ty: " + point3d.y);
					console.log("Tz: " + point3d.z);*/

				break;
			default:
				console.error("Unknown '" + type + "' transformation.");
				break;
		}
	}

	//console.log(matrix);
	return matrix;
}

MySceneGraph.prototype.parseComponents = function (element) {
	var components = element.children;
	var cl = components.length;
	var id, transformation, matrixTransformation, material, materialId, textureId, primitives, compon;


	console.log("componetes:" + cl);
	for (var i = 0; i < cl; i++) {
	//	console.log(components[i]);

		//console.log(components[i]);
		id = components[i].attributes.getNamedItem('id').value;

		//transformation
		transformation = components[i].getElementsByTagName('transformation')[0];

		if (transformation == null)
			return "transformation(component) element is missing.";


		if (transformation.children.length == 0)
			matrixTransformation = mat4.create();

		else {
			if (transformation.children[0].tagName == "transformationref") {
				matrixTransformation = transformation.children[0].id;
			}
			else
				matrixTransformation = this.readTransformation(transformation);
		}

		//	console.log("transformation");
		//	console.log(matrixTransformation);

		//material 
		material = components[i].getElementsByTagName('materials')[0];
		materialId = material.children[0].id;
		//console.log("materialID: " + materialId);

		//texture

		textureId = components[i].getElementsByTagName('texture')[0].id;
		//console.log(textureId);

		//childrens
		var primitiveref = [], children;
		children = components[i].getElementsByTagName('children')[0];
		primitives = children.getElementsByTagName('primitiveref');

		for (var j = 0; j < primitives.length; j++)
			primitiveref.push(primitives[j].id);

		var componentref = [];
		compon = children.getElementsByTagName('componentref');
		for (var j = 0; j < compon.length; j++)
			componentref.push(compon[j].id);

		this.component[id] = new Component(id, matrixTransformation, textureId, materialId, componentref, primitiveref);


	}
};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);
	this.loadedOk = false;
};


