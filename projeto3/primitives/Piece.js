/**
 * Piece
 * @constructor
 */
function Piece(scene, height, tile) {
    CGFobject.call(this, scene);

    this.pyramid = new Pyramid(this.scene);
    this.razonZ = 0.9;
    this.height = height;
    this.tile = tile;

};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.setTile = function(origin, dest) {
    console.debug(origin);
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

    for (var i = 0; i < this.height; i++) {
        this.pyramid.display();
        this.razon -= 0.05
        this.ofset = this.ofset * this.razon;
        this.scene.translate(0, 0.8, 0);
        this.scene.scale(this.razon, this.razon * this.razonZ, this.razon);
    }
    this.scene.popMatrix();

};