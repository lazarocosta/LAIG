/**
 * Board
 * @constructor
 */
function Board(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.auxiliarBoardP1 = new AuxBoard(scene);
    this.auxiliarBoardP2 = new AuxBoard(scene);
    this.gameBoard = new Gameboard(scene);

    this.IndexPlayer1 = 0;
    this.IndexPlayer2 = 0;





    this.initBoard();
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.initBoard = function() {

    //Player1
    this.bigPieceP1_1 = new Piece(this.scene, 4, this.gameBoard.tiles[0][0], 1);
    this.bigPieceP1_2 = new Piece(this.scene, 4, this.gameBoard.tiles[0][8], 1);
    this.normalPieceP1_1 = new Piece(this.scene, 3, this.gameBoard.tiles[1][2], 1);
    this.normalPieceP1_2 = new Piece(this.scene, 3, this.gameBoard.tiles[1][6], 1);
    this.smallPieceP1_1 = new Piece(this.scene, 2, this.gameBoard.tiles[1][3], 1);
    this.smallPieceP1_2 = new Piece(this.scene, 2, this.gameBoard.tiles[1][4], 1);
    this.smallPieceP1_3 = new Piece(this.scene, 2, this.gameBoard.tiles[1][5], 1);
    this.smallPieceP1_4 = new Piece(this.scene, 2, this.gameBoard.tiles[2][4], 1);

    this.gameBoard.tiles[0][0].setPiece(this.bigPieceP1_1);
    this.gameBoard.tiles[8][0].setPiece(this.bigPieceP1_2);
    this.gameBoard.tiles[2][1].setPiece(this.normalPieceP1_1);
    this.gameBoard.tiles[6][1].setPiece(this.normalPieceP1_2);
    this.gameBoard.tiles[3][1].setPiece(this.smallPieceP1_1);
    this.gameBoard.tiles[4][1].setPiece(this.smallPieceP1_3);
    this.gameBoard.tiles[5][1].setPiece(this.smallPieceP1_3);
    this.gameBoard.tiles[4][2].setPiece(this.smallPieceP1_4);


    //Player2
    this.bigPieceP2_1 = new Piece(this.scene, 4, this.gameBoard.tiles[0][8], 2);
    this.bigPieceP2_2 = new Piece(this.scene, 4, this.gameBoard.tiles[8][8], 2);
    this.normalPieceP2_1 = new Piece(this.scene, 3, this.gameBoard.tiles[2][7], 2);
    this.normalPieceP2_2 = new Piece(this.scene, 3, this.gameBoard.tiles[6][7], 2);
    this.smallPieceP2_1 = new Piece(this.scene, 2, this.gameBoard.tiles[4][7], 2);
    this.smallPieceP2_2 = new Piece(this.scene, 2, this.gameBoard.tiles[5][7], 2);
    this.smallPieceP2_3 = new Piece(this.scene, 2, this.gameBoard.tiles[6][7], 2);
    this.smallPieceP2_4 = new Piece(this.scene, 2, this.gameBoard.tiles[4][6], 2);

    this.gameBoard.tiles[0][8].setPiece(this.bigPieceP2_1);
    this.gameBoard.tiles[8][8].setPiece(this.bigPieceP2_2);
    this.gameBoard.tiles[2][7].setPiece(this.normalPieceP2_1);
    this.gameBoard.tiles[6][7].setPiece(this.normalPieceP2_2);
    this.gameBoard.tiles[3][7].setPiece(this.smallPieceP2_1);
    this.gameBoard.tiles[4][7].setPiece(this.smallPieceP2_2);
    this.gameBoard.tiles[5][7].setPiece(this.smallPieceP2_3);
    this.gameBoard.tiles[4][6].setPiece(this.smallPieceP2_4);


};

Board.prototype.display = function() {

    this.gameBoard.display();
    this.auxiliarBoardP1.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 11.3, 0);
    this.auxiliarBoardP2.display();
    this.scene.popMatrix();
}


Board.prototype.remove = function(oldcol, oldrow, Player) {
    var origin = this.gameBoard.tiles[oldcol][oldrow];
    var piece = this.gameBoard.tiles[oldcol][oldrow].getPiece();
    console.debug(piece);
    var player = piece.getPlayer();
    var dest;

    if (player == 1) {
        dest = this.auxiliarBoardP1.tiles[this.IndexPlayer1];
        this.IndexPlayer1++;
    }

    if (player == 2) {
        dest = this.auxiliarBoardP1.tiles[this.IndexPlayer2];
        this.IndexPlayer2++;
    }

    piece.setTile(origin, dest);
}