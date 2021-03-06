
function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;

    this.scene.initGraph(this);


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
    this.animations = {};
    this.primitives = {};
    this.components = {};


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
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;
    var error = null;

    this.loadedOk = true;

    // Here should go the calls for different functions to parse the various blocks

    error = this.parse(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();

};


MySceneGraph.prototype.parse = function(rootElement) {
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
                console.log("Parse transformations");
                error = this.parseTransformations(element);
                if (count != 6)
                    order = false;
                count++;
                break;
            case 'animations':
                console.log("Parse animations");
                error = this.parseAnimations(element);
                if (count != 7)
                    order = false;
                count++;
                break;
            case 'primitives':
                console.log("Parse primitives");
                error = this.parsePrimitives(element);
                if (count != 8)
                    order = false;
                count++;
                break;
            case 'components':
                console.log("Parse components");
                error = this.parseComponents(element);
                if (count != 9)
                    order = false;
                count++;
                break;
            default:
                check[name] = false;
                console.warn("Ignoring '" + name + "' since it's not a valid element");
                break;
        }
        if (error != null) {
            return error;
        }
        if (!order)
            console.warn("Element " + name + " is out of place!");
    }
};

MySceneGraph.prototype.getRGBAElem = function(rootElement) {
    var r = this.reader.getFloat(rootElement, 'r');
    var g = this.reader.getFloat(rootElement, 'g');
    var b = this.reader.getFloat(rootElement, 'b');
    var a = this.reader.getFloat(rootElement, 'a');
    var rgba = new RGBA(r, g, b, a);

    return rgba;
};

MySceneGraph.prototype.getPoint3D = function(rootElement) {
    var x = this.reader.getFloat(rootElement, 'x');
    var y = this.reader.getFloat(rootElement, 'y');
    var z = this.reader.getFloat(rootElement, 'z');
    var point = new Point3D(x, y, z)

    return point;
};

MySceneGraph.prototype.parseScene = function(element) {
    this.root = this.reader.getString(element, 'root');
    this.axisLength = this.reader.getFloat(element, 'axis_length');
};

MySceneGraph.prototype.parseViews = function(element) {
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

MySceneGraph.prototype.parseIllumination = function(element) {
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

MySceneGraph.prototype.parseLights = function(element) {

    var lights = element.children;
    var ll = lights.length;

    if (ll < 1) {
        return "zero lights found";
    }
    var o = 0;
    var s = 0;

    for (var i = 0; i < ll; i++) {

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

MySceneGraph.prototype.parseTextures = function(element) {
    var textures = element.children;
    var tl = textures.length;

    for (var i = 0; i < tl; i++) {
        var texture = textures[i];
        var name = texture.tagName;
        switch (name) {
            case 'texture':
                var id = texture.id;
                var file = new CGFtexture(this.scene, this.reader.getString(texture, 'file'));
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

MySceneGraph.prototype.parseMaterials = function(element) {
    var materials = element.children;
    var mlength = materials.length;

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

MySceneGraph.prototype.readTransformation = function(element) {
    var transformation = element.children;
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

MySceneGraph.prototype.parseTransformations = function(element) {
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

MySceneGraph.prototype.parseAnimations = function(element) {
    var animations = element.children;
    var al = animations.length;

    if (al < 1)
        return "no animations found";

    for (var i = 0; i < al; i++) {
        var animation = animations[i];
        var name = animation.tagName;
        if (name != 'animation') {
            console.warn("Invalid tag name for supposed animation nº " + i + ".");
            continue;
        }
        var id = animation.id;
        var span = this.reader.getFloat(animation, 'span');
        var type = this.reader.getString(animation, 'type');

        switch (type) {
            case 'linear':
                var points = animation.children;
                var pl = points.length;
                if (pl < 1) {
                    console.warn("No control points found for animation '" + id + "'.");
                    continue;
                }
                var cpoints = [];
                for (var j = 0; j < pl; j++) {
                    var cpoint = points[j];
                    var cpname = cpoint.tagName;
                    if (cpname != 'controlpoint') {
                        console.warn("Invalid tag name for control point in animation '" + id + "'.");
                        continue;
                    }
                    var px = this.reader.getFloat(cpoint, 'xx');
                    var py = this.reader.getFloat(cpoint, 'yy');
                    var pz = this.reader.getFloat(cpoint, 'zz');
					var point = new Point3D(px, py, pz);
                    cpoints.push(point);
                }
                this.animations[id] = new LinearAnimation(span, cpoints);
				//console.debug(this.animations);
                break;
            case 'circular':
                var cx = this.reader.getFloat(animation, 'centerx');
                var cy = this.reader.getFloat(animation, 'centery');
                var cz = this.reader.getFloat(animation, 'centerz');
                var center = new Point3D(cx, cy, cz);
                var radius = this.reader.getFloat(animation, 'radius');
                var sang = this.reader.getFloat(animation, 'startang');
                var rang = this.reader.getFloat(animation, 'rotang');
                this.animations[id] = new CircularAnimation(span, center, radius, sang, rang);
                break;
            default:
                console.warn("Invalid animation type for animation '" + id + "'.");
                break;
        }
    }
}

MySceneGraph.prototype.parsePrimitives = function(element) {
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
                this.primitives[id] = new Rectangle(this.scene, x1, y1, x2, y2);
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
                this.primitives[id] = new Triangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                break;
            case 'cylinder':
                var base = this.reader.getFloat(object, 'base');
                var top = this.reader.getFloat(object, 'top');
                var height = this.reader.getFloat(object, 'height');
                var slices = this.reader.getFloat(object, 'slices');
                var stacks = this.reader.getFloat(object, 'stacks');
                this.primitives[id] = new Cylinder(this.scene, base, top, height, slices, stacks);
                break;
            case 'sphere':
                var radius = this.reader.getFloat(object, 'radius');
                var slices = this.reader.getFloat(object, 'slices');
                var stacks = this.reader.getFloat(object, 'stacks');
                this.primitives[id] = new Sphere(this.scene, slices, stacks, radius);
                break;
            case 'torus':
                var inner = this.reader.getFloat(object, 'inner');
                var outer = this.reader.getFloat(object, 'outer');
                var slices = this.reader.getFloat(object, 'slices');
                var loops = this.reader.getFloat(object, 'loops');
                this.primitives[id] = new Torus(this.scene, inner, outer, slices, loops);
                break;
            case 'plane':
                var dimX = this.reader.getFloat(object, 'dimX');
                var dimY = this.reader.getFloat(object, 'dimY');
                var partsX = this.reader.getInteger(object, 'partsX');
                var partsY = this.reader.getInteger(object, 'partsY');
                this.primitives[id] = new Plane(this.scene, dimX, dimY, partsX, partsY);
                break;
            case 'chessboard':
                var du = this.reader.getInteger(object, 'du');
                var dv = this.reader.getInteger(object, 'dv');
                var textureref = this.reader.getString(object, 'textureref');
                var su = this.reader.getInteger(object, 'su');
                var sv = this.reader.getInteger(object, 'sv');

                if (object.children.length != 3)
                    return "invalid number of color";

                for (var j = 0; j < 3; j++) {
                    var colorLine = object.children[j];
                    var color = colorLine.tagName;
                    var color1, color2, colorMark;
                    switch (color) {
                        case 'c1':
                            var r = this.reader.getFloat(colorLine, 'r');
                            var g = this.reader.getFloat(colorLine, 'g');
                            var b = this.reader.getFloat(colorLine, 'b');
                            var a = this.reader.getFloat(colorLine, 'a');
                            color1 = [r, g, b, a];
                            break;
                        case 'c2':
                            var r = this.reader.getFloat(colorLine, 'r');
                            var g = this.reader.getFloat(colorLine, 'g');
                            var b = this.reader.getFloat(colorLine, 'b');
                            var a = this.reader.getFloat(colorLine, 'a');
                            color2 = [r, g, b, a];
                            break;
                        case 'cs':
                            var r = this.reader.getFloat(colorLine, 'r');
                            var g = this.reader.getFloat(colorLine, 'g');
                            var b = this.reader.getFloat(colorLine, 'b');
                            var a = this.reader.getFloat(colorLine, 'a');
                            colorMark = [r, g, b, a];
                            break;
                        default:
                            console.warn("Invalid color name");
                            break;
                    }
                }
                this.primitives[id] = new Chessboard(this.scene, du, dv, textureref, color1, color2, colorMark, su, sv);
                break;
            case 'patch':
                var orderU = this.reader.getInteger(object, 'orderU');
                var orderV = this.reader.getInteger(object, 'orderV');
                var partsU = this.reader.getInteger(object, 'partsU');
                var partsV = this.reader.getInteger(object, 'partsV');
                var points = object.children;
                var pointsLength = points.length;
                var controlPoints = [];
                for (var h = 0; h < pointsLength; h++) {
                    var pname = points[h].tagName;
                    if (pname != 'controlpoint') {
                        console.warn("Invalid tag name '" + pname + "'! ");
                        continue;
                    }
                    var px = this.reader.getFloat(points[h], 'x');
                    var py = this.reader.getFloat(points[h], 'y');
                    var pz = this.reader.getFloat(points[h], 'z');
                    var point = [px, py, pz, 1];
                    controlPoints.push(point);

                }

                var npoints = (orderU + 1) * (orderV + 1);
                if (npoints != h) {
                    return "number of points for primitive patch invalid!";
                }
                this.primitives[id] = new Patch(this.scene, orderU, orderV, partsU, partsV, controlPoints);
                break;
            case 'vehicle':
                this.primitives[id] = new Vehicle(this.scene);
                break;
            default:
                console.warn("No such primitive named '" + objname + "'!");
                break;
        }
    }

};

MySceneGraph.prototype.parseComponents = function(element) {
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
        var canimations = [];
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
                case 'animation':
                    var animations = temp.children;
                    var al = animations.length;
                    for (var k = 0; k < al; k++) {
                        var animation = animations[k];
                        var aname = animation.tagName;
                        if (aname != 'animationref') {
                            console.warn("Invalid tag name '" + aname + "'! Tag name should be 'animationref'!");
                            continue;
                        }
                        var aid = animation.id;
                        if (this.animations[aid] == null) {
                            console.error("Animation with id '" + aid + "' doesn't exist!");
                            continue;
                        }
                        canimations.push(this.animations[aid]);
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
        this.components[id] = new Component(id, matrixTransformation, materialsId, textureId, componentref, primitiveref, canimations);
    }
};

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};

MySceneGraph.prototype.display = function() {
    if (this.loadedOk) {
        var mati = this.scene.matIndex % this.components[this.root].materialsId.length;
        var material = this.components[this.root].materialsId[mati];
        var texture = this.components[this.root].textureId;
        var rootMaterial = this.materials[material];
        this.scene.multMatrix(this.components[this.root].matrixTransformation);
        this.init(this.root, rootMaterial, texture);
    }
}

MySceneGraph.prototype.init = function(rootId, rootMaterial, texture) {
    var root = this.components[rootId];
    var componentRoot, transformation;

    //primitives
    for (var i = 0; i < root.primitiveref.length; i++) {

        var type = root.primitiveref[i];
        if (texture != 'none') {
            var t = this.textures[texture];
            rootMaterial.setTexture(t.file);
        }

        rootMaterial.apply();
        this.primitives[type].display();
        rootMaterial.setTexture(null);
    }

    //node's componentref
    var materialId, textureId, materialChildren, textureChildren
    for (var i = 0; i < root.componentref.length; i++) {
        this.scene.pushMatrix();
        componentRoot = root.componentref[i];
        var component = this.components[componentRoot];
        //animation
        var animation = component.getCurrentAnimation();
        if (animation != null) {
			//console.debug(animation);
            animation.apply(this.scene);
        }
        //transformation
        transformation = component.matrixTransformation;
        this.scene.multMatrix(transformation);
        //material
        var mlength = this.components[componentRoot].materialsId.length;
        materialId = this.components[componentRoot].materialsId[this.scene.matIndex % mlength];
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
        textureId = this.components[componentRoot].textureId;
        switch (textureId) {
            case 'inherit':
                textureChildren = texture;
                break;
            default:
                textureChildren = textureId;
                break;
        }
        this.init(componentRoot, materialChildren, textureChildren);
        this.scene.popMatrix();
    }

}

MySceneGraph.prototype.update = function(dtime) {
    for (var key in this.primitives) {
        /*if (this.primitives[key] instanceof Chessboard)
          this.primitives[key].updateMark();
    */}
    for (var component in this.components) {
        this.components[component].update(dtime);
    }
}