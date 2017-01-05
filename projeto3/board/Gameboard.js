/**
 * Gameboard
 * @constructor
 */
function Gameboard(scene, board, textureBoard, selectableSpace) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.player_0_points;
    this.player_1_points;

    this.board = board;
    this.tiles = new Array(9);


    this.materialPlace = new CGFappearance(scene);
    var texture = this.scene.graph.textures[textureBoard];
    this.materialPlace.setTexture(texture.file);

    this.materialSelectable = new CGFappearance(scene);
    var texture2 = this.scene.graph.textures[selectableSpace];
    this.materialSelectable.setTexture(texture2.file);

    this.initGameboard();

    //this.countPoints(0);
    //this.countPoints(1);
    // console.debug(this.player_0_points);

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
            var posicion = new Point2(j, i);
            this.tiles[j][i] = new Tile(this.scene, id, null, this.materialPlace, this.materialSelectable, this.board, posicion);
        }
    }
};

Gameboard.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

Gameboard.prototype.move = function(oldcol, oldrow, newcol, newrow) {
    var piece = this.tiles[oldcol][oldrow].getPiece();
    var origin = this.tiles[oldcol][oldrow];
    var dest = this.tiles[newcol][newrow];
    piece.setTile(origin, dest);
    this.scene.interface.game.move(oldcol, oldrow, newcol, newrow);
}

Gameboard.prototype.countPoints = function(player) {
    this.player_0_points = 0;
    this.player_1_points = 0
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (this.tiles[j][i].piece != null) {
                var piece = this.tiles[j][i].piece;
                var player = piece.player;
                var points = piece.height;

                if (player == 0)
                    this.player_0_points += points;

                if (player == 1)
                    this.player_1_points += points;
            }
        }
    }
}

Gameboard.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, 0.5, 0);

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {

            this.scene.pushMatrix();
            this.scene.translate((j + j * 0.05), i + i * 0.05, 0);

            this.tiles[j][i].display();
            this.scene.popMatrix();
        }
    }
    this.scene.popMatrix();
}