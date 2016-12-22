/**
 * Board
 * @constructor
 */
function Board(scene) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.auxiliarBoardP1 = new AuxBoard(scene, this);
    this.auxiliarBoardP2 = new AuxBoard(scene, this);
    this.gameBoard = new Gameboard(scene, this);

    this.lengthBoard = 9;
    this.IndexPlayer1 = 0;
    this.IndexPlayer2 = 0;
    this.pieces = new Array(16);

    this.initBoard();
    this.turnPlayer(2);
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

    this.bigPieceP2_1 = new Piece(this.scene, 3, this.gameBoard.tiles[0][8], 2, 9, this);
    this.bigPieceP2_2 = new Piece(this.scene, 3, this.gameBoard.tiles[8][8], 2, 10, this);
    this.normalPieceP2_1 = new Piece(this.scene, 2, this.gameBoard.tiles[2][7], 2, 11, this);
    this.normalPieceP2_2 = new Piece(this.scene, 2, this.gameBoard.tiles[6][7], 2, 12, this);
    this.smallPieceP2_1 = new Piece(this.scene, 1, this.gameBoard.tiles[3][7], 2, 13, this);
    this.smallPieceP2_2 = new Piece(this.scene, 1, this.gameBoard.tiles[4][7], 2, 14, this);
    this.smallPieceP2_3 = new Piece(this.scene, 1, this.gameBoard.tiles[5][7], 2, 15, this);
    this.smallPieceP2_4 = new Piece(this.scene, 1, this.gameBoard.tiles[4][6], 2, 16, this);


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

    for (var j = x; j <= x + height && j < 9; j++)
        this.gameBoard.tiles[j][y].enableselection();

    for (var j = x; j >= x - height && j >= 0; j--)
        this.gameBoard.tiles[j][y].enableselection();

    for (var i = y; i <= y + height && i < 9; i++)
        this.gameBoard.tiles[x][i].enableselection();

    for (var i = y; i >= y - height && i >= 0; i--)
        this.gameBoard.tiles[x][i].enableselection();
}

Board.prototype.getPieceSelected = function() {

    for (i = 0; i < this.pieces.length; i++)
        if (this.pieces[i].selected == true)
            return this.pieces[i];
}

Board.prototype.turnPlayer = function(player) {

    for (var i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].player == player)
            this.pieces[i].disableselection();
        else
            this.pieces[i].enableselection();
    }
}

Board.prototype.display = function() {

    this.gameBoard.display();
    this.scene.clearPickRegistration();
    this.auxiliarBoardP1.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 11.3, 0);
    this.auxiliarBoardP2.display();
    this.scene.popMatrix();
}

Board.prototype.piecesLine = function(picePoint, moveVector) {

    var distX = moveVector.x;
    var distY = moveVector.y;
    var pointX = picePoint.x;
    var pointY = picePoint.y;
    var piecesLine = [];

    if (distX != 0) {
        if (distX > 0) {
            for (var i = pointX + 1; i < this.lengthBoard; i++) {
                var piece = this.gameBoard.getTile(i, pointY).getPiece();
                if (piece != null)
                    piecesLine.push(piece);
            }
        } else if (distX < 0) {
            for (var i = pointX - 1; i >= 0; i--) {
                var piece = this.gameBoard.getTile(i, pointY).getPiece();
                if (piece != null)
                    piecesLine.push(piece);
            }
        }
    } else if (distY != 0) {
        if (distY > 0) {
            for (var i = pointY + 1; i < this.lengthBoard; i++) {
                var piece = this.gameBoard.getTile(pointX, i).getPiece();
                if (piece != null)
                    piecesLine.push(piece);
            }
        } else if (distY < 0) {
            for (var i = pointY - 1; i >= 0; i--) {
                var piece = this.gameBoard.getTile(pointX, i).getPiece();
                if (piece != null)
                    piecesLine.push(piece);
            }
        }
    }
    return piecesLine;
}

Board.prototype.countEmptySpaces = function(piece, targetPiece) {

    var targetPointX = targetPiece.tile.point.x;
    var targetPointY = targetPiece.tile.point.y;

    var picePointX = piece.tile.point.x;
    var picePointY = piece.tile.point.y;

    var distX = targetPointX - picePointX;
    var distY = targetPointY - picePointY;

    var count = 0;

    if (distX != 0) {
        if (distX > 0) {
            for (var i = picePointX + 1; i < targetPointX; i++) {
                var piece = this.gameBoard.getTile(i, picePointY).getPiece();
                if (piece == null)
                    count++;
            }
        } else if (distX < 0) {
            for (var i = picePointX - 1; i > targetPointX; i--) {
                var piece = this.gameBoard.getTile(i, picePointY).getPiece();
                if (piece == null)
                    count++
            }
        }
    } else if (distY != 0) {
        if (distY > 0) {
            for (var i = picePointY + 1; i < targetPointY; i++) {
                var piece = this.gameBoard.getTile(picePointX, i).getPiece();
                if (piece == null)
                    count++;
            }
        } else if (distY < 0) {
            for (var i = picePointY - 1; i > targetPointY; i--) {
                var piece = this.gameBoard.getTile(picePointX, i).getPiece();
                if (piece == null)
                    count++
            }
        }
    }
    return count;
}

Board.prototype.makeMove = function(moveVector, piece, piecesLine) {


    var moveX = false;
    var dist;
    var positive = false;
    if (moveVector.x != 0) {
        moveX = true;
        if (moveVector.x > 0)
            positive = true;
        dist = Math.abs(moveVector.x);
    } else {
        if (moveVector.y > 0)
            positive = true;
        dist = Math.abs(moveVector.y);
    }
    var emptySpaces;
    for (var i = piecesLine.length - 1; i >= 0; i--) {
        emptySpaces = this.countEmptySpaces(piece, piecesLine[i]);
        if (emptySpaces >= dist) {
            console.debug('continue');
            continue;
        }

        var distBoar;
        var pointXPiece = piecesLine[i].tile.point.x;
        var pointYPiece = piecesLine[i].tile.point.y;
        if (moveX) {
            if (positive)
                distBoar = (this.lengthBoard - 1) - pointXPiece;
            else
                distBoar = pointXPiece;
        } else
        if (!moveX) {
            if (positive)
                distBoar = (this.lengthBoard - 1) - pointYPiece;
            else
                distBoar = pointYPiece;
        }
        var deslocation = dist - emptySpaces;
        if (deslocation > distBoar) {
            this.remove(pointXPiece, pointYPiece);
            continue;
        }

        //_____translate piece
        console.debug('translate');

        if (moveX)
            if (positive)
                this.gameBoard.move(pointXPiece, pointYPiece, pointXPiece + deslocation, pointYPiece);
            else
                this.gameBoard.move(pointXPiece, pointYPiece, pointXPiece - deslocation, pointYPiece);
        else
        if (!moveX)
            if (positive)
                this.gameBoard.move(pointXPiece, pointYPiece, pointXPiece, pointYPiece + deslocation);
            else
                this.gameBoard.move(pointXPiece, pointYPiece, pointXPiece, pointYPiece - deslocation);
    }
    return 1;
}