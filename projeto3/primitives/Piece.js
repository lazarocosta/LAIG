/**
 * Piece
 * @constructor
 */
function Piece(scene, height, tile, player, id, board) {
    CGFobject.call(this, scene);

    this.board = board;
    this.id = id
    this.pyramid = new Pyramid(scene);
    this.razonZ = 0.9;
    this.height = height;
    this.tile = tile;
    this.player = player;
    this.texture = new CGFappearance(scene);
    this.textureSelect = new CGFappearance(scene);
    this.scene = scene;
    this.selected = false;
    this.selectable = true;
    console.debug(tile);

    if (player == 1)
        this.texture.loadTexture("resources\\casa.jpg");

    if (player == 2)
        this.texture.loadTexture("resources\\preto.jpg");

    this.textureSelect.loadTexture("resources\\luz.jpg");

};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.setTile = function(origin, dest) {
    origin.setPiece(null);
    dest.setPiece(this);
    this.tile = dest;
};

Piece.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);

    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.ofset = 2;
    this.razon = 1;
    if (this.height == 2)
        this.scene.scale(1, 0.8, 0.8);

    this.scene.scale(this.ofset, this.ofset * this.razonZ, this.ofset);

    this.texture.apply();

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


Piece.prototype.select = function() {
    this.selected = !this.selected;
    this.board.noSelectAllPieces(this.id);

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