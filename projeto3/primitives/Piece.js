/**
 * Piece
 * @constructor
 */
function Piece(scene, height, tile, player, id, board, texturePiece1, texturePiece2, texturePieceSelected) {
    CGFobject.call(this, scene);

    this.board = board;
    this.id = id
    this.pyramid = new Pyramid(scene);
    this.razonZ = 0.9;
    this.height = height;
    this.tile = tile;
    this.player = player;
    this.materialPiece = new CGFappearance(scene);
    this.textureSelect = new CGFappearance(scene);
    this.scene = scene;
    this.selected = false;
    this.selectable = false;


    if (player == 0) {
        var piecetexture = this.scene.graph.textures[texturePiece1];
        this.materialPiece.setTexture(piecetexture.file);
    }


    if (player == 1) {
        var piecetexture = this.scene.graph.textures[texturePiece2];
        this.materialPiece.setTexture(piecetexture.file);
    }

    var pieceSelected = this.scene.graph.textures[texturePieceSelected];
    this.textureSelect.setTexture(pieceSelected.file);
};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.setTile = function(origin, dest) {
    origin.setPiece(null);
    dest.setPiece(this);
    this.tile = dest;
};

Piece.prototype.select = function() {
    this.selected = true;
    this.board.noSelectAllPieces(this.id);
    this.board.noSelectAllTiles(null);
    this.board.disableSelectionAllTiles(null);
    this.board.selectNext(this.tile.getPoint(), this.height);
    this.board.getPieceSelected();
}

Piece.prototype.noSelect = function() {
    this.selected = false
}

Piece.prototype.enableselection = function() {
    this.selectable = true;
}

Piece.prototype.disableselection = function() {
    this.selectable = false;
}


Piece.prototype.getPlayer = function() {
    return this.player;
}

Piece.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);

    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.ofset = 2;
    this.razon = 1;
    if (this.height == 2)
        this.scene.scale(1, 0.8, 0.8);

    this.scene.scale(this.ofset, this.ofset * this.razonZ, this.ofset);

    this.materialPiece.apply();

    if (this.selectable)
        this.scene.registerForPick(this.id, this);

    if (this.selected)
        this.textureSelect.apply();

    for (var i = 0; i <= this.height; i++) {

        this.pyramid.display();

        this.razon -= 0.05
        this.ofset = this.ofset * this.razon;
        this.scene.translate(0, 0.8, 0);
        this.scene.scale(this.razon, this.razon * this.razonZ, this.razon);
    }
    this.scene.clearPickRegistration();
    this.scene.popMatrix();
};