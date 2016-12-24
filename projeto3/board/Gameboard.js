/**
 * Gameboard
 * @constructor
 */
function Gameboard(scene, board, textureBoard, selectableSpace) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.board = board;
    this.tiles = new Array(9);


    this.materialPlace = new CGFappearance(scene);
    var texture = this.scene.graph.textures[textureBoard];
    this.materialPlace.setTexture(texture.file);

    this.materialSelectable = new CGFappearance(scene);
    var texture2 = this.scene.graph.textures[selectableSpace];
    this.materialSelectable.setTexture(texture2.file);

    this.initGameboard();
};

Gameboard.prototype = Object.create(CGFobject.prototype);
Gameboard.prototype.constructor = Gameboard;

Gameboard.prototype.initGameboard = function() {

    for (var i = 0; i < 9; i++) {
        this.tiles[i] = new Array(9);
    }

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var id = parseInt((i + 1) + "" + (j + 1) + "9");
            var posicion = new Point2(j, i);
            this.tiles[j][i] = new Tile(this.scene, id, null, this.materialPlace, this.materialSelectable, this.board, posicion);
        }
    }
};

Gameboard.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

Gameboard.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, 0.5, 0);

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {

            this.scene.pushMatrix();
            this.scene.translate((j + j * 0.05), i + i * 0.05, 0);

            this.tiles[j][i].display();
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();
}

Gameboard.prototype.move = function(oldcol, oldrow, newcol, newrow) {
    var piece = this.tiles[oldcol][oldrow].getPiece();
    var origin = this.tiles[oldcol][oldrow];
    var dest = this.tiles[newcol][newrow]
    piece.setTile(origin, dest);
}