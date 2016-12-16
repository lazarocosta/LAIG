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

    this.bigPiece1 = new Piece(this.scene, 4, this.tiles[0][0]);
    this.bigPiece2 = new Piece(this.scene, 4, this.tiles[0][8]);

    this.normalPiece1 = new Piece(this.scene, 3, this.tiles[1][2]);
    this.normalPiece2 = new Piece(this.scene, 3, this.tiles[1][6]);

    this.smallPiece1 = new Piece(this.scene, 2, this.tiles[1][3]);
    this.smallPiece2 = new Piece(this.scene, 2, this.tiles[1][4]);
    this.smallPiece3 = new Piece(this.scene, 2, this.tiles[1][5]);
    this.smallPiece4 = new Piece(this.scene, 2, this.tiles[2][4]);

    this.tiles[0][0].setPiece(this.bigPiece1);
    this.tiles[8][0].setPiece(this.bigPiece2);

    this.tiles[2][1].setPiece(this.normalPiece1);
    this.tiles[6][1].setPiece(this.normalPiece2);

    this.tiles[3][1].setPiece(this.smallPiece1);
    this.tiles[4][1].setPiece(this.smallPiece3);
    this.tiles[5][1].setPiece(this.smallPiece3);
    this.tiles[4][2].setPiece(this.smallPiece4);


    //Player2
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