/**
 * AuxBoard
 * @constructor
 */
function AuxBoard(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.tiles = new Array(9);

    this.initAuxBoard();
};

AuxBoard.prototype = Object.create(CGFobject.prototype);
AuxBoard.prototype.constructor = AuxBoard;

AuxBoard.prototype.initAuxBoard = function() {

    for (var i = 0; i < 9; i++) {
        var id = i + 1;
        this.tiles[i] = new Tile(this.scene, id, null);
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