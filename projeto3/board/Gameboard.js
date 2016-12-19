/**
 * Gameboard
 * @constructor
 */
function Gameboard(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.tiles = new Array(9);

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
            var id = parseInt((i + 1) + "" + (j + 1));
            console.log(id);
            this.tiles[j][i] = new Tile(this.scene, id, null);
        }
    }
};

Gameboard.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

Gameboard.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, 0.5, 0);



    //this.scene.scale(0.4,0.4,0.4);

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {

            this.scene.pushMatrix();
            this.scene.translate((j + j * 0.05), i + i * 0.05, 0);
            this.scene.registerForPick(this.tiles[j][i].id, this.tiles[j][i]);
            //this.logPicking();
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


Gameboard.prototype.logPicking = function() {
    if (this.scene.pickMode == false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (var i = 0; i < this.scene.pickResults.length; i) {
                var obj = this.scene.pickResults[i][0];
                if (obj) {
                    var Id = this.scene.pickResults[i][1];
                    obj.select();
                    console.log(obj);
                    console.log("Picked with pick id ", this.id);
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
}