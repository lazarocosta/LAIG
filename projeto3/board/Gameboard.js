/**
 * Gameboard
 * @constructor
 */
function Gameboard(scene, board) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.board = board;
    this.tiles = new Array(9);

    var texture = new CGFtexture(scene, "resources\\vermelho.jpg");
    var texture1 = new CGFtexture(scene, "resources\\vidro.jpg");
    var texture2 = new CGFtexture(scene, "resources\\madeira.jpg");

    this.materialPlace = new CGFappearance(scene);
    this.materialSelected = new CGFappearance(scene);
    this.materialSelectable = new CGFappearance(scene);

    this.materialPlace.setTexture(texture);
    this.materialSelected.setTexture(texture1);
    this.materialSelectable.setTexture(texture2);

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
            this.tiles[j][i] = new Tile(this.scene, id, null, this.materialPlace, this.materialSelected, this.materialSelectable, this.board);
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

            // if (!(j == 4 && i == 1)) {
            this.tiles[j][i].display();
            //}
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