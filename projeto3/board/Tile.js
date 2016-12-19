/**
 * Tile
 * @constructor
 */

function Tile(scene, id) {
    CGFobject.call(this, scene);

    this.id = id;
    this.place = new Plane(scene, 1, 1, 1, 1);
    this.piece = null;
    this.selected = false;
    this.selectable = false;
};

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;


Tile.prototype.display = function() {

    this.scene.pushMatrix();

    if (this.selectable)
        this.scene.registerForPick(this.id, this);

    if (this.selected) {
        this.scene.translate(0, 0, 1);
    }

    if (this.piece != null)
        this.piece.display();

    this.place.display();
    this.scene.popMatrix();
}

Tile.prototype.setPiece = function(piece) {
    this.piece = piece;
}


Tile.prototype.select = function() {
    this.selected = !this.selected;
}

Tile.prototype.enableselection = function() {
    this.selectable = true;
}

Tile.prototype.disableselection = function() {
    this.selectable = false;
}

Tile.prototype.getPiece = function() {
    return this.piece;
}