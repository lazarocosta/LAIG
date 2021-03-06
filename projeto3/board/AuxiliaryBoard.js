/**
 * AuxBoard
 * @constructor
 */
function AuxBoard(scene, board, textureAuxBoard) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.board = board;

    this.tiles = new Array(9);

    this.materialPlace = new CGFappearance(scene);
    var texture = this.scene.graph.textures[textureAuxBoard];
    this.materialPlace.setTexture(texture.file);

    this.initAuxBoard();
};

AuxBoard.prototype = Object.create(CGFobject.prototype);
AuxBoard.prototype.constructor = AuxBoard;

AuxBoard.prototype.initAuxBoard = function() {

    for (var i = 0; i < 9; i++) {
        var id = i + 1;
        this.tiles[i] = new Tile(this.scene, null, null, this.materialPlace, null, this.board, null);
    }

};

AuxBoard.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

AuxBoard.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, -1, 0);

    for (var i = 0; i < 9; i++) {

        this.scene.pushMatrix();
        this.scene.translate(i + i * 0.05, 0, 0);

        this.tiles[i].display();
        this.scene.popMatrix();
    }
    this.scene.popMatrix();
}