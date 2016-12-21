/**
 * Board
 * @constructor
 */
function Board(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    //this.auxiliarBoardP1 = new AuxBoard(scene);
    //this.auxiliarBoardP2 = new AuxBoard(scene);
    this.gameBoard = new Gameboard(scene, this);

    this.IndexPlayer1 = 0;
    this.IndexPlayer2 = 0;
    this.pieces = new Array(16);

    this.initBoard();
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.initBoard = function() {

    //Player1
    this.bigPieceP1_1 = new Piece(this.scene, 3, this.gameBoard.tiles[0][0], 1, 1, this);
    this.bigPieceP1_2 = new Piece(this.scene, 3, this.gameBoard.tiles[8][0], 1, 2, this);
    this.normalPieceP1_1 = new Piece(this.scene, 2, this.gameBoard.tiles[2][1], 1, 3, this);
    this.normalPieceP1_2 = new Piece(this.scene, 2, this.gameBoard.tiles[6][1], 1, 4, this);
    this.smallPieceP1_1 = new Piece(this.scene, 1, this.gameBoard.tiles[3][1], 1, 5, this);
    this.smallPieceP1_2 = new Piece(this.scene, 1, this.gameBoard.tiles[4][1], 1, 6, this);
    this.smallPieceP1_3 = new Piece(this.scene, 1, this.gameBoard.tiles[5][1], 1, 7, this);
    this.smallPieceP1_4 = new Piece(this.scene, 1, this.gameBoard.tiles[4][2], 1, 8, this);

    this.gameBoard.tiles[0][0].setPiece(this.bigPieceP1_1);
    this.gameBoard.tiles[8][0].setPiece(this.bigPieceP1_2);
    this.gameBoard.tiles[2][1].setPiece(this.normalPieceP1_1);
    this.gameBoard.tiles[6][1].setPiece(this.normalPieceP1_2);
    this.gameBoard.tiles[3][1].setPiece(this.smallPieceP1_1);
    this.gameBoard.tiles[4][1].setPiece(this.smallPieceP1_2);
    this.gameBoard.tiles[5][1].setPiece(this.smallPieceP1_3);
    this.gameBoard.tiles[4][2].setPiece(this.smallPieceP1_4);


    //Player2

    this.bigPieceP2_1 = new Piece(this.scene, 3, this.gameBoard.tiles[0][8], 1, 9, this);
    this.bigPieceP2_2 = new Piece(this.scene, 3, this.gameBoard.tiles[8][8], 1, 10, this);
    this.normalPieceP2_1 = new Piece(this.scene, 2, this.gameBoard.tiles[2][7], 1, 11, this);
    this.normalPieceP2_2 = new Piece(this.scene, 2, this.gameBoard.tiles[6][7], 1, 12, this);
    this.smallPieceP2_1 = new Piece(this.scene, 1, this.gameBoard.tiles[3][7], 1, 13, this);
    this.smallPieceP2_2 = new Piece(this.scene, 1, this.gameBoard.tiles[4][7], 1, 14, this);
    this.smallPieceP2_3 = new Piece(this.scene, 1, this.gameBoard.tiles[5][7], 1, 15, this);
    this.smallPieceP2_4 = new Piece(this.scene, 1, this.gameBoard.tiles[4][6], 1, 16, this);


    this.gameBoard.tiles[0][8].setPiece(this.bigPieceP2_1);
    this.gameBoard.tiles[8][8].setPiece(this.bigPieceP2_2);
    this.gameBoard.tiles[2][7].setPiece(this.normalPieceP2_1);
    this.gameBoard.tiles[6][7].setPiece(this.normalPieceP2_2);
    this.gameBoard.tiles[3][7].setPiece(this.smallPieceP2_1);
    this.gameBoard.tiles[4][7].setPiece(this.smallPieceP2_2);
    this.gameBoard.tiles[5][7].setPiece(this.smallPieceP2_3);
    this.gameBoard.tiles[4][6].setPiece(this.smallPieceP2_4);

    this.pieces = [
        this.bigPieceP1_1,
        this.bigPieceP1_2,
        this.normalPieceP1_1,
        this.normalPieceP1_2,
        this.smallPieceP1_1,
        this.smallPieceP1_2,
        this.smallPieceP1_3,
        this.smallPieceP1_4,

        this.bigPieceP2_1,
        this.bigPieceP2_2,
        this.normalPieceP2_1,
        this.normalPieceP2_2,
        this.smallPieceP2_1,
        this.smallPieceP2_2,
        this.smallPieceP2_3,
        this.smallPieceP2_4
    ];
};

Board.prototype.display = function() {

    this.gameBoard.display();
    this.scene.clearPickRegistration();
    // this.auxiliarBoardP1.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 11.3, 0);
    //this.auxiliarBoardP2.display();
    this.scene.popMatrix();
}


Board.prototype.remove = function(oldcol, oldrow) {
    var origin = this.gameBoard.tiles[oldcol][oldrow];
    var piece = this.gameBoard.tiles[oldcol][oldrow].getPiece();
    var player = piece.getPlayer();
    var dest;

    if (player == 1) {
        dest = this.auxiliarBoardP1.tiles[this.IndexPlayer1];
        this.IndexPlayer1++;
    }

    if (player == 2) {
        dest = this.auxiliarBoardP2.tiles[this.IndexPlayer2];
        this.IndexPlayer2++;
    }
    piece.setTile(origin, dest);
}

Board.prototype.noSelectAllPieces = function(id) {
    for (var i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].id != id)
            this.pieces[i].noSelect();
    }
}

Board.prototype.disableSelectionAllTiles = function(id) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (this.gameBoard.tiles[j][i].id != id)
                this.gameBoard.tiles[j][i].disableselection();
        }
    }
}

Board.prototype.noSelectAllTiles = function(id) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (this.gameBoard.tiles[j][i].id != id)
                this.gameBoard.tiles[j][i].noSelect();
        }
    }
}

Board.prototype.selectNext = function(position, height) {
    var x = position.getx();
    var y = position.gety();

    for (var j = x; j <= x + height && j < 9; j++) {
        this.gameBoard.tiles[j][y].enableselection();
    }

    for (var j = x; j >= x - height && j >= 0; j--) {
        this.gameBoard.tiles[j][y].enableselection();
    }

    for (var i = y; i <= y + height && i < 9; i++) {
        this.gameBoard.tiles[x][i].enableselection();
    }

    for (var i = y; i >= y - height && i >= 0; i--) {
        this.gameBoard.tiles[x][i].enableselection();
    }

}


Board.prototype.getPieceSelected = function() {

    for (i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].selected == true) {
            return this.pieces[i].tile.point;

        }
    }
}