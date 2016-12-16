/**
 * Board
 * @constructor
 */
function Board(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.tiles = new Array(9);

    this.initBoard();
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.initBoard = function() {

    for (var i = 0; i < 9; i++) {
        this.tiles[i] = new Array(9);
    }

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var id = (i + 1) + "" + (j + 1);
            console.log(id);
            this.tiles[j][i] = new BoardTile(this.scene, id, null);
        }
    }
    //Player1

    this.bigPieceP1_1 = new Piece(this.scene, 4, this.tiles[0][0]);
    this.bigPieceP1_2 = new Piece(this.scene, 4, this.tiles[0][8]);
    this.normalPieceP1_1 = new Piece(this.scene, 3, this.tiles[1][2]);
    this.normalPieceP1_2 = new Piece(this.scene, 3, this.tiles[1][6]);
    this.smallPieceP1_1 = new Piece(this.scene, 2, this.tiles[1][3]);
    this.smallPieceP1_2 = new Piece(this.scene, 2, this.tiles[1][4]);
    this.smallPieceP1_3 = new Piece(this.scene, 2, this.tiles[1][5]);
    this.smallPieceP1_4 = new Piece(this.scene, 2, this.tiles[2][4]);

    this.tiles[0][0].setPiece(this.bigPieceP1_1);
    this.tiles[8][0].setPiece(this.bigPieceP1_2);
    this.tiles[2][1].setPiece(this.normalPieceP1_1);
    this.tiles[6][1].setPiece(this.normalPieceP1_2);
    this.tiles[3][1].setPiece(this.smallPieceP1_1);
    this.tiles[4][1].setPiece(this.smallPieceP1_3);
    this.tiles[5][1].setPiece(this.smallPieceP1_3);
    this.tiles[4][2].setPiece(this.smallPieceP1_4);


    //Player2
    this.bigPieceP2_1 = new Piece(this.scene, 4, this.tiles[0][8]);
    this.bigPieceP2_2 = new Piece(this.scene, 4, this.tiles[8][8]);
    this.normalPieceP2_1 = new Piece(this.scene, 3, this.tiles[2][7]);
    this.normalPieceP2_2 = new Piece(this.scene, 3, this.tiles[6][7]);
    this.smallPieceP2_1 = new Piece(this.scene, 2, this.tiles[4][7]);
    this.smallPieceP2_2 = new Piece(this.scene, 2, this.tiles[5][7]);
    this.smallPieceP2_3 = new Piece(this.scene, 2, this.tiles[6][7]);
    this.smallPieceP2_4 = new Piece(this.scene, 2, this.tiles[4][6]);

    this.tiles[0][8].setPiece(this.bigPieceP2_1);
    this.tiles[8][8].setPiece(this.bigPieceP2_2);
    this.tiles[2][7].setPiece(this.normalPieceP2_1);
    this.tiles[6][7].setPiece(this.normalPieceP2_2);
    this.tiles[3][7].setPiece(this.smallPieceP2_1);
    this.tiles[4][7].setPiece(this.smallPieceP2_2);
    this.tiles[5][7].setPiece(this.smallPieceP2_3);
    this.tiles[4][6].setPiece(this.smallPieceP2_4);

    //this.move(0, 0, 0, 4);

};

Board.prototype.getTile = function(col, row) {
    return this.tiles[col][row];
};

Board.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.5, 0.5, 0);

    //this.scene.scale(0.4,0.4,0.4);

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

Board.prototype.move = function(oldcol, oldrow, newcol, newrow) {
    var piece = this.tiles[oldcol][oldrow].getPiece();
    var origin = this.tiles[oldcol][oldrow];
    var dest = this.tiles[newcol][newrow]
    piece.setTile(origin, dest);
}