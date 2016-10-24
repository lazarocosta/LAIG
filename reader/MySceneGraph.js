
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
				console.log("Parse scene");
				error = this.parseScene(element);
				if (count != 0)
					order = false;
				count++;
				break;
			case 'views':
				console.log("Parse views");
				error = this.parseViews(element);
				if (count != 1)
					order = false;
				count++;
				break;
			case 'illumination':
				console.log("Parse illumination");
				error = this.parseIllumination(element);
				if (count != 2)
					order = false;
				count++;
				break;
			case 'lights':
				console.log("Parse lights");
				error = this.parseLights(element);
				if (count != 3)
					order = false;
				count++;
				break;
			case 'textures':
				console.log("Parse textures");
				error = this.parseTextures(element);
				if (count != 4)
					order = false;
				count++;
				break;
			case 'materials':
				console.log("Parse materials");
				error = this.parseMaterials(element);
				if (count != 5)
					order = false;
				count++;
				break;
			case 'transformations':
				console.log("Parse");
				error = this.parseTransformations(element);
				if (count != 6)
					order = false;
				count++;
				break;
			case 'primitives':
				console.log("Parse primitives");
				error = this.parsePrimitives(element);
				if (count != 7)
					order = false;
				count++;
				break;
			case 'components':
				console.log("Parse components");
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
				break;
			case 'ambient':
				ambient = component;
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

	for (var i = 0; i < ll; i++) {
		var o = 0;
		var s = 0;
		var light = lights[i];
		var name = lights[i].tagName;
		var id, enabled, location, ambient, diffuse, specular, root;
		var angle, exponent, target;
		switch (name) {
			case 'omni':
				id = light.id;
				enabled = this.reader.getBoolean(light, 'enabled');
				location = light.getElementsByTagName('location')[0];
				ambient = light.getElementsByTagName('ambient')[0];
				diffuse = light.getElementsByTagName('diffuse')[0];
				specular = light.getElementsByTagName('specular')[0];
				this.omni[o++] = new Omni(id, enabled, this.getPoint3D(location), this.getRGBAElem(ambient), this.getRGBAElem(diffuse), this.getRGBAElem(specular));
				break;
			case 'spot':
				id = light.id;
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
};

MySceneGraph.prototype.parseTextures = function (element) {
	var textures = element.children;
	var tl = textures.length;

	for (var i = 0; i < tl; i++) {
		var texture = textures[i];
		var name = texture.tagName;
		switch (name) {
			case 'texture':
				var id = texture.id;
				var file = texture.attributes.getNamedItem('file').value;
				var length_s = this.reader.getFloat(texture, 'length_s');
				var length_t = this.reader.getFloat(texture, 'length_t');
				if (this.textures[id] != null) {
					console.error("There's already a texture with id='" + id + "'!");
					continue;
				}
				this.textures[id] = new Texture(id, file, length_s, length_t);
				break;
			default:
				console.warn("Invalid element name '" + name + "' for supposed transformation!");
				break;
		}
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
				return "More than one '" + name + "' element found!";
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
					console.warn("'" + name + "' is not an element of material!");
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
		material.setTextureWrap('REPEAT', 'REPEAT');
		if (this.materials[id] != null) {
			console.error("There's already a material with id='" + id + "'!");
			continue;
		}
		this.materials[id] = material;
	}

};

MySceneGraph.prototype.readTransformation = function (element) {
	var transformation = element.children;
	//console.debug(element);
	var length = transformation.length;

	if (length < 1) {
		console.error("missing transformations");
		return null;
	}
	var matrix = mat4.create();

	for (var j = 0; j < length; j++) {
		var tr = transformation[j];
		var type = tr.tagName;
		switch (type) {
			case 'translate':
				point3d = this.getPoint3D(tr);
				mat4.translate(matrix, matrix, [point3d.x, point3d.y, point3d.z]);
				break;
			case 'rotate':
				var raxis = tr.attributes.getNamedItem('axis').value;
				var rangle = this.reader.getFloat(tr, 'angle');
				rangle = rangle * Math.PI / 180;
				var rmatrix;
				switch (raxis) {
					case 'x':
						rmatrix = [1, 0, 0];
						break;
					case 'y':
						rmatrix = [0, 1, 0];
						break;
					case 'z':
						rmatrix = [0, 0, 1];
						break;
					default:
						console.error("invalid axis for rotation");
						return;
				}
				mat4.rotate(matrix, matrix, rangle, rmatrix);
				break;
			case 'scale':
				point3d = this.getPoint3D(tr);
				mat4.scale(matrix, matrix, [point3d.x, point3d.y, point3d.z]);
				break;
			default:
				console.warn("Unknown '" + type + "' transformation.");
				break;
		}
	}
	return matrix;
}

MySceneGraph.prototype.parseTransformations = function (element) {
	var matrix = mat4.create();
	var transformations = element.children;

	var tl = transformations.length;

	if (tl < 1)
		return "zero transformations found";


	for (var i = 0; i < tl; i++) {
		var transformation = transformations[i];
		if (transformation.tagName != 'transformation') {
			console.warn("Invalid tag name for supposed transformation nº " + i + ".");
			continue;
		}
		var id = transformation.id;
		matrix = this.readTransformation(transformation);
		if (this.transformations[id] != null) {
			console.error("There's already a transformation with id='" + id + "'!");
			continue;
		}
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
			console.warn("Invalid tag name for supposed primitive nº " + i + ".");
			continue;
		}
		var id = primi.id;
		var object = primi.children[0];
		var objname = object.tagName;
		if (this.primitives[id] != null) {
			console.error("There's already a primitive with id='" + id + "'!");
			continue;
		}
		switch (objname) {
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
				console.warn("No such primitive named '" + objname + "'!");
				break;
		}
	}
};

MySceneGraph.prototype.parseComponents = function (element) {
	var components = element.children;
	var cl = components.length;

	//console.debug(cl);

	for (var i = 0; i < cl; i++) {
		var component = components[i];
		//console.debug(component);
		var id = component.id;
		var settings = component.children;
		var n = settings.length;
		var primitiveref = [];
		var componentref = [];
		var matrixTransformation, textureId;
		var materialsId = [];
		for (var j = 0; j < n; j++) {
			var temp = settings[j];
			var name = temp.tagName;
			var check = {};
			var texture;
			if (check[name]) {
				return "More than one '" + name + "' element found!";
			} else {
				check[name] = true;
			}
			switch (name) {
				case 'transformation':
					var transformations = temp.children;
					var tn = transformations.length;
					matrixTransformation = mat4.create();
					var Tref = false;

					var Tnormal = false;
					for (var k = 0; k < tn; k++) {
						var transformation = transformations[k];
						var tname = transformation.tagName;
						switch (tname) {
							case 'rotate':
							case 'translate':
							case 'scale':
								Tnormal = true;
								break;
							case 'transformationref':
								if (Tref) {
									return "you can only use one transformationref for a component";
								}
								Tref = true;
								if (this.transformations[transformation.id] == null) {
									return "no transformation '" + transformation.id + "' was found!";
								}
								matrixTransformation = this.transformations[transformation.id];
								break;
							default:
								console.warn("invalid '" + name + "' element in transformation for component id='" + id + "'");
								break;
						}
					}
					if (Tnormal && Tref) {
						return "you must only use transformationref or define a transformation in component id='" + id + "'";
					} else if (Tnormal) {
						matrixTransformation = this.readTransformation(temp);
					}
					break;
				case 'materials':
					var materials = temp.children;
					var ml = materials.length;
					for (var k = 0; k < ml; k++) {
						var material = materials[k];
						var materialId = material.id;
						if (materialId != 'inherit' && this.materials[materialId] == null) {
							return "no material '" + materialId + "' was found for component id='" + id + "'!";
						}
						materialsId.push(materialId);
					}
					break;
				case 'texture':
					texture = temp;
					textureId = texture.id;
					if (textureId != 'inherit' && textureId != 'none' && this.textures[textureId] == null) {
						return "no texture '" + textureId + "' was found for component id='" + id + "'!";
					}
					break;
				case 'children':
					var children = temp.children;
					var chl = children.length;
					for (var k = 0; k < chl; k++) {
						var cname = children[k].tagName;
						switch (cname) {
							case 'primitiveref':
								primitiveref.push(children[k].id);
								break;
							case 'componentref':
								componentref.push(children[k].id);
								break;
							default:
								console.warn("");
								break;
						}
					}
					break;
				default:
					console.warn("Invalid element '" + name + "' for a supposed component!");
					check[name] = false;
					break;
			}
		}
		this.component[id] = new Component(id, matrixTransformation, materialsId, textureId, componentref, primitiveref);
	}
};

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);
	this.loadedOk = false;
};

MySceneGraph.prototype.display = function () {

	var material = this.component[this.root].materialsId[this.scene.matIndex % this.component[this.root].materialsId.length];
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
		/*if (stackTexture.top() != "none")*/
		//rootMaterial.setTexture(rootTexture);
		//console.log(rootMaterial);

		var type = root.primitiveref[i];
		rootMaterial.apply();
		this.primitives[type].display();

		//material.setTexture(null);
	}

	var materialId, textureId, materialChildren, textureChildren
	for (var i = 0; i < root.componentref.length; i++) {
		this.scene.pushMatrix();
		componentRoot = root.componentref[i];
		//transformation
		transformation = this.component[componentRoot].matrixTransformation;
		this.scene.multMatrix(transformation);
		//material
		var mlength = this.component[componentRoot].materialsId.length;
		materialId = this.component[componentRoot].materialsId[this.scene.matIndex % mlength];
		switch (materialId) {
			case 'inherit':
				materialChildren = rootMaterial;
				break;
			case 'none':
				break;
			default:
				materialChildren = this.materials[materialId];
				break;
		}
		materialChildren.setTexture(null);
		//texture
		textureId = this.component[componentRoot].textureId;
		switch (textureId) {
			case 'inherit':
				textureChildren = rootTexture;
				break;
			default:
				textureChildren = this.textures[textureId];
				break;
		}
		this.init(componentRoot, materialChildren, textureChildren);
		this.scene.popMatrix();
	}
}




