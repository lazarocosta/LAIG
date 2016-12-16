/**
 * BoardTile
 * @constructor
 */

function BoardTile(scene, id) {
    CGFobject.call(this, scene);

    this.id = id;
    this.place = new Plane(scene, 1, 1, 1, 1);
    this.piece = null;
    //this.selected=false;
    //this.selectable=false;
};

BoardTile.prototype = Object.create(CGFobject.prototype);
BoardTile.prototype.constructor = BoardTile;


BoardTile.prototype.display = function() {

    this.scene.pushMatrix();

    /*	if(this.selectable)
      	this.scene.registerForPick(this.id, this);

    	if(this.selected)
    		this.scene.translate(0,0,1);*/

    if (this.piece != null)
        this.piece.display();

    this.place.display();
    this.scene.popMatrix();
}

BoardTile.prototype.setPiece = function(piece) {
    this.piece = piece;
}

/*
BoardTile.prototype.select = function() {
	this.selected = !this.selected;
}

BoardTile.prototype.enableselection = function() {
	this.selectable = true;
}

BoardTile.prototype.disableselection = function() {
	this.selectable = false;
}*/

BoardTile.prototype.getPiece = function() {
    return this.piece;
}