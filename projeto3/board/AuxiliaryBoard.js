/**
 * AuxBoard
 * @constructor
 */
function AuxBoard(scene, board) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.board = board;

    this.tiles = new Array(9);
    var texture2 = new CGFtexture(scene, "resources\\madeira.jpg");

    this.materialPlace = new CGFappearance(scene);
    this.materialPlace.setTexture(texture2);
    console.debug(this.materialPlace);

    this.initAuxBoard();



};

AuxBoard.prototype = Object.create(CGFobject.prototype);
AuxBoard.prototype.constructor = AuxBoard;

AuxBoard.prototype.initAuxBoard = function() {

    for (var i = 0; i < 9; i++) {
        var id = i + 1;
        this.tiles[i] = new Tile(this.scene, null, null, this.materialPlace, null, null, this.board, null);
    }

};

AuxBoard.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

AuxBoard.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, -1, 0);

    //this.scene.scale(0.4,0.4,0.4);

    for (var i = 0; i < 9; i++) {

        this.scene.pushMatrix();
        this.scene.translate(i + i * 0.05, 0, 0);

        this.tiles[i].display();
        this.scene.popMatrix();
    }
    this.scene.popMatrix();
}

/*
AuxBoard.prototype.move = function(oldcol, oldrow, newcol, newrow) {
    var piece = this.tiles[oldcol][oldrow].getPiece();
    var origin = this.tiles[oldcol][oldrow];
    var dest = this.tiles[newcol][newrow]
    piece.setTile(origin, dest);
}
*/