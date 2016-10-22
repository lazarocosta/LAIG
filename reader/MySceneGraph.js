
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
	var count = 0; //to check the order of the elements
	var error = null;
	for (var i = 0; i < n; i++) {
		var element = rootElement.children[i];
		var name = element.tagName;
		//console.log(name);
		if (check[name]) {
			return "more than one '" + name + "' element found";
		} else {
			check[name] = true;
		}
		order = true;
		switch (name) {
			case 'scene':
				//console.log("Parse scene");
				error = this.parseScene(element);
				if (count != 0)
					order = false;
				count++;
				break;
			case 'views':
				//console.log("Parse");
				error = this.parseViews(element);
				if (count != 1)
					order = false;
				count++;
				break;
			case 'illumination':
				//console.log("Parse");
				error = this.parseIllumination(element);
				if (count != 2)
					order = false;
				count++;
				break;
			case 'lights':
				//console.log("Parse");
				error = this.parseLights(element);
				if (count != 3)
					order = false;
				count++;
				break;
			case 'textures':
				//console.log("Parse");
				error = this.parseTextures(element);
				if (count != 4)
					order = false;
				count++;
				break;
			case 'materials':
				//console.log("Parse");
				error = this.parseMaterials(element);
				if (count != 5)
					order = false;
				count++;
				break;
			case 'transformations':
				//console.log("Parse");
				error = this.parseTransformations(element);
				if (count != 6)
					order = false;
				count++;
				break;
			case 'primitives':
				//console.log("Parse");
				error = this.parsePrimitives(element);
				if (count != 7)
					order = false;
				count++;
				break;
			case 'components':
				//console.log("Parse");
				error = this.parseComponents(element);
				if (count != 8)
					order = false;
				count++;
				break;
			default:
				check[name] = false;
				console.warn("ignoring '" + name + "' since it's not a valid element");
				break;
		}
		if (error != null) {
			this.onXMLError(error);
			return;
		}
		if (!order)
			console.warn("Element " + name + " is out of place!");
	}

};

MySceneGraph.prototype.getRGBAElem = function (rootElement) {
	var r = this.reader.getFloat(rootElement, 'r');
	var g = this.reader.getFloat(rootElement, 'g');
	var b = this.reader.getFloat(rootElement, 'b');
	var a = this.reader.getFloat(rootElement, 'a');
	var rgba = new RGBA(r, g, b, a);

	return rgba;
};

MySceneGraph.prototype.getPoint3D = function (rootElement) {
	var x = this.reader.getFloat(rootElement, 'x');
	var y = this.reader.getFloat(rootElement, 'y');
	var z = this.reader.getFloat(rootElement, 'z');
	var point = new Point3D(x, y, z)

	return point;
};

MySceneGraph.prototype.parseScene = function (element) {
	this.root = this.reader.getString(element, 'root');
	this.axisLength = this.reader.getFloat(element, 'axis_length');
};

MySceneGraph.prototype.parseViews = function (element) {
	var perspectives = element.children;
	var pl = perspectives.length;
	for (var i = 0; i < pl; i++) {
		var perspective = perspectives[i];
		var name = perspective.tagName;

		var id = this.reader.getString(perspective, 'id');
		var near = this.reader.getFloat(perspective, 'near');
		var far = this.reader.getFloat(perspective, 'far');
		var angle = this.reader.getFloat(perspective, 'angle');
		angle = angle * Math.PI / 180;
		var from = perspective.getElementsByTagName('from')[0];
		var to = perspective.getElementsByTagName('to')[0];

		var fromPoint = this.getPoint3D(from);
		var toPoint = this.getPoint3D(to);
		this.views[i] = new CGFcamera(angle, near, far, vec3.fromValues(fromPoint.x, fromPoint.y, fromPoint.z), vec3.fromValues(toPoint.x, toPoint.y, toPoint.z));
	}
};

MySceneGraph.prototype.parseIllumination = function (element) {
	var illumi = element;
	var components = element.children;
	var cl = components.length;

	var check = {};
	check['background'] = false;
	check['ambient'] = false;

	if (cl < 0)
		return "no illumination components were found!";

	var local = this.reader.getBoolean(illumi, 'local');
	var doublesided = this.reader.getBoolean(illumi, 'doublesided');
	var background;
	var ambient;

	for (var i = 0; i < cl; i++) {
		var component = components[i];
		var name = component.tagName;
		if (check[name]) {
			return "more than one '" + name + "' element found";
		} else {
			check[name] = true;
		}
		switch (name) {
			case 'background':
				background = component;
				check[name] = true;
				break;
			case 'ambient':
				ambient = component;
				console.debug(ambient);
				check[name] = true;
				break;
			default:
				console.warn(name + " is not a component of illumination!");
				check[name] = false;
				break;
		}
	}

	this.illumination = new Illumination(doublesided, local, this.getRGBAElem(ambient), this.getRGBAElem(background));
};

MySceneGraph.prototype.parseLights = function (element) {

	var lights = element.children;
	var ll = lights.length;

	if (ll < 1) {
		return "zero lights found";
	}

	//console.log(omni.length);

	for (var i = 0; i < ll; i++) {
		var o = 0;
		var s = 0;
		var light = lights[i];
		var name = lights[i].tagName;
		var id, enabled, location, ambient, diffuse, specular, root;
		var angle, exponent, target;
		switch (name) {
			case 'omni':
				id = this.reader.getString(light, 'id');
				enabled = this.reader.getBoolean(light, 'enabled');
				location = light.getElementsByTagName('location')[0];
				ambient = light.getElementsByTagName('ambient')[0];
				diffuse = light.getElementsByTagName('diffuse')[0];
				specular = light.getElementsByTagName('specular')[0];
				this.omni[o++] = new Omni(id, enabled, this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));
				break;
			case 'spot':
				id = this.reader.getString(light, 'id');
				enabled = this.reader.getBoolean(light, 'enabled');
				angle = this.reader.getFloat(light, 'angle');
				angle = angle * Math.PI / 180;
				exponent = this.reader.getFloat(light, 'exponent');
				target = light.getElementsByTagName('target')[0];
				location = light.getElementsByTagName('location')[0];
				ambient = light.getElementsByTagName('ambient')[0];
				diffuse = light.getElementsByTagName('diffuse')[0];
				specular = light.getElementsByTagName('specular')[0];
				this.spot[s++] = new Spot(id, enabled, angle, exponent, this.getPoint3D(target), this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));
				break;
			default:
				console.warn(name + " is not a type of light!");
				break;
		}
	}

	/*
	var light = element, omni, spot;
	omni = light.getElementsByTagName('omni');
	spot = light.getElementsByTagName('spot');

	if (omni == null && spot == null)
		return "have not lights";

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
	}

	var angle, exponent, target;
	for (i = 0; i < spot.length; i++) {
		root = spot[i];

		id = this.reader.getString(root, 'id');
		enabled = this.reader.getBoolean(root, 'enabled');
		angle = this.reader.getFloat(root, 'angle');
		angle = angle * Math.PI / 180;
		exponent = this.reader.getFloat(root, 'exponent');
		target = root.getElementsByTagName('target')[0];
		location = root.getElementsByTagName('location')[0];
		ambient = root.getElementsByTagName('ambient')[0];
		diffuse = root.getElementsByTagName('diffuse')[0];
		specular = root.getElementsByTagName('specular')[0];

		this.spot[i] = new Spot(id, enabled, angle, exponent, this.getPoint3D(target), this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));
	}*/
};

MySceneGraph.prototype.parseTextures = function (element) {
	var root = element;

	if (root == null)
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

		this.textures[id] = new Texture(id, file, length_s, length_t);
	}
};

MySceneGraph.prototype.parseMaterials = function (element) {
	var materials = element.children;
	var mlength = materials.length;

	/*for (var i = 0; i < materials.length; i++)
		console.log(materials[i]);*/

	if (mlength < 1)
		return "zero materials found";

	for (var i = 0; i < mlength; i++) {
		if (materials[i].tagName != 'material') {
			console.warn("Invalid tag name for supposed material!");
			continue;
		}
		var material = materials[i];
		var mspecs = material.children;
		var id = material.id;
		var msl = mspecs.length;
		var check = {};
		check['emission'] = false;
		check['ambient'] = false;
		check['diffuse'] = false;
		check['specular'] = false;
		check['shininess'] = false;
		var emission, ambient, diffuse, specular, shininess;
		for (var j = 0; j < msl; j++) {
			var spec = mspecs[j];
			var name = spec.tagName;
			if (check[name]) {
				console.error("More than one '" + name + "' element found!");
			} else {
				check[name] = true;
			}
			switch (name) {
				case 'emission':
					emission = this.getRGBAElem(spec);
					break;
				case 'ambient':
					ambient = this.getRGBAElem(spec);
					break;
				case 'diffuse':
					diffuse = this.getRGBAElem(spec);
					break;
				case 'specular':
					specular = this.getRGBAElem(spec);
					break;
				case 'shininess':
					shininess = this.reader.getFloat(spec, 'value');
					break;
				default:
					console.warning("'" + name + "' is not an element of material!");
					check[name] = false;
					break;
			}
		}

		var material = new CGFappearance(this.scene);
		
		material.setEmission(emission.r, emission.g, emission.b, emission.a);
		material.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
		material.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
		material.setSpecular(specular.r, specular.g, specular.b, specular.a);
		material.setShininess(shininess);
		this.materials[id] = material;
	}

};

MySceneGraph.prototype.parseTransformations = function (element) {
	var matrix = mat4.create();
	var transformations = element.getElementsByTagName('transformation');

	if (transformations == null)
		return "transformations element is missing.";

	var tl = transformations.length;

	if (tl < 1)
		return "zero transformations found";

	for (var i = 0; i < tl; i++) {
		var transformation = transformations[i];

		if (transformation.tagName != 'transformation') {
			console.warn("Invalid tag name for supposed transformation nº " + i + ".");
			continue;
		}
		var id = transformation.id, point3d;
		matrix = this.readTransformation(transformation);
		this.transformations[id] = matrix;
	}

};

MySceneGraph.prototype.parsePrimitives = function (element) {
	var primitives = element;
	var primitive = primitives.getElementsByTagName('primitive');
	var pl = primitive.length;

	if (pl < 1)
		return "zero primitives found";

	for (var i = 0; i < pl; i++) {
		var primi = primitive[i];
		var name = primi.tagName;

		if (name != 'primitive') {
			console.error("Invalid tag name for supposed primitive nº " + i + ".");
		}
		var id = primi.id;
		var object = primi.children[0];
		switch (object.tagName) {
			case 'rectangle':
				var x1 = this.reader.getFloat(object, 'x1');
				var y1 = this.reader.getFloat(object, 'y1');
				var x2 = this.reader.getFloat(object, 'x2');
				var y2 = this.reader.getFloat(object, 'y2');
				this.primitives[id] = new MyRectangle(this.scene, x1, y1, x2, y2);
				break;

			case 'triangle':
				var x1 = this.reader.getFloat(object, 'x1');
				var y1 = this.reader.getFloat(object, 'y1');
				var z1 = this.reader.getFloat(object, 'z1');
				var x2 = this.reader.getFloat(object, 'x2');
				var y2 = this.reader.getFloat(object, 'y2');
				var z2 = this.reader.getFloat(object, 'z2');
				var x3 = this.reader.getFloat(object, 'x3');
				var y3 = this.reader.getFloat(object, 'y3');
				var z3 = this.reader.getFloat(object, 'z3');
				this.primitives[id] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;

			case 'cylinder':
				var base = this.reader.getFloat(object, 'base');
				var top = this.reader.getFloat(object, 'top');
				var height = this.reader.getFloat(object, 'height');
				var slices = this.reader.getFloat(object, 'slices');
				var stacks = this.reader.getFloat(object, 'stacks');
				this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
				break;

			case 'sphere':
				var radius = this.reader.getFloat(object, 'radius');
				var slices = this.reader.getFloat(object, 'slices');
				var stacks = this.reader.getFloat(object, 'stacks');
				this.primitives[id] = new MySphere(this.scene, slices, stacks, radius);
				break;

			case 'torus':
				var inner = this.reader.getFloat(object, 'inner');
				var outer = this.reader.getFloat(object, 'outer');
				var slices = this.reader.getFloat(object, 'slices');
				var loops = this.reader.getFloat(object, 'loops');
				this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
				break;
			default:
				console.error("You're just dumb, read the instructions you fuck (if you have no instructions then I am sorry - ty braga senpai for this)");
				break;
		}
	}
};

MySceneGraph.prototype.readTransformation = function (element) {
	var transformation = element;

	if (element.children.length == 0)
		return "missing transformations";

	for (var j = 0; j < transformation.children.length; j++) {
		var tr = transformation.children[j];
		var type = tr.tagName;
		var matrix = mat4.create();
		switch (type) {

			case 'translate':
				point3d = this.getPoint3D(tr);
				mat4.translate(matrix, matrix, [point3d.x, point3d.y, point3d.z]);
				break;

			case 'rotate':
				var raxis = tr.attributes.getNamedItem('axis').value;
				var rangle = tr.attributes.getNamedItem('angle').value;
				rangle = rangle * Math.PI / 180;
				if (raxis == "x")
					mat4.rotate(matrix, matrix, rangle, [1, 0, 0]);
				else if (raxis == "y")
					mat4.rotate(matrix, matrix, rangle, [0, 1, 0]);
				else if (raxis == "z")
					mat4.rotate(matrix, matrix, rangle, [0, 0, 1]);

				break;
			case 'scale':
				point3d = this.getPoint3D(tr);
				mat4.scale(matrix, matrix, [point3d.x, point3d.y, point3d.z]);

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


	//console.log("componetes:" + cl);
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

				matrixTransformation = this.transformations[transformation.children[0].id];
				//console.log(matrixTransformation);
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

		this.component[id] = new Component(id, matrixTransformation, materialId, textureId, componentref, primitiveref);


	}
};

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);
	this.loadedOk = false;
};

MySceneGraph.prototype.display = function () {

	var material = this.component[this.root].materialId;
	var texture = this.component[this.root].textureId;
	var rootMaterial = this.materials[material];
	var rootTexture = this.textures[texture];

	this.scene.multMatrix(this.component[this.root].matrixTransformation);
	this.init(this.root, rootMaterial, rootMaterial);
}
MySceneGraph.prototype.init = function (rootId, rootMaterial, rootTexture) {

	/*if (rootMaterial == "inherit")
		return "Material no defined";

	if (rootTexture == "inherit")
		return "Texture no defined";*/

	var root = this.component[rootId];
	var componentRoot, transformation;

	for (var i = 0; i < root.primitiveref.length; i++) {
		/*if (stackTexture.top() != "none")
			material.setTexture(this.textures[stackTexture.top()].file);
		*/

		var type = root.primitiveref[i];

		rootMaterial.apply()
		this.primitives[type].display();

		//material.setTexture(null);
	}

	var materialId, textureId, materialChildren, textureChildren
	for (var i = 0; i < root.componentref.length; i++) {

		this.scene.pushMatrix();

		componentRoot = root.componentref[i];
		transformation = this.component[componentRoot].matrixTransformation;
		this.scene.multMatrix(transformation);
		materialId = this.component[componentRoot].materialId;

		if (materialId == "inherit") {
			materialChildren = rootMaterial;
		}
		else {
			materialChildren = this.materials[materialId];
		}


		textureId = this.component[componentRoot].textureId;
		if (textureId == "inherit")
			textureChildren = rootTexture;
		else
			textureChildren = this.textures[textureId];

		this.init(componentRoot, materialChildren, textureChildren);
		this.scene.popMatrix();
	}
}




