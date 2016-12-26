/**
 * Board
 * @constructor
 */
function Board(scene, texturePiece1, texturePiece2, texturePieceSelected, textureBoard, selectableSpace, textureAuxBoard) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.plays = [];
    this.second = 0;
    this.video = false;
    this.IndexPlayed = 0;
    this.reset = false;

    this.playerWaiting = 1;
    this.clock = new MyClock(scene, 15, 15);

    this.texturePiece1 = texturePiece1;
    this.texturePiece2 = texturePiece2;
    this.texturePieceSelected = texturePieceSelected;


    this.auxiliarBoardP1 = new AuxBoard(scene, this, textureAuxBoard);
    this.auxiliarBoardP2 = new AuxBoard(scene, this, textureAuxBoard);
    this.gameBoard = new Gameboard(scene, this, textureBoard, selectableSpace);

    this.lengthBoard = 9;
    this.IndexPlayer1 = 0;
    this.IndexPlayer2 = 0;
    this.pieces = new Array(16);

    this.initPieces();
    this.initBoard();
    this.disabledPlayer(this.playerWaiting);

    this.gameBoard.countPoints(0);


    this.gameBoard.countPoints(1);

    console.debug(this.gameBoard.player_0_points);
    console.debug(this.gameBoard.player_1_points);
};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;



Board.prototype.initPieces = function() {

    //Player1
    this.bigPieceP1_1 = new Piece(this.scene, 3, this.gameBoard.tiles[0][0], 0, 1, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.bigPieceP1_2 = new Piece(this.scene, 3, this.gameBoard.tiles[8][0], 0, 2, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.normalPieceP1_1 = new Piece(this.scene, 2, this.gameBoard.tiles[2][1], 0, 3, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.normalPieceP1_2 = new Piece(this.scene, 2, this.gameBoard.tiles[6][1], 0, 4, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP1_1 = new Piece(this.scene, 1, this.gameBoard.tiles[3][1], 0, 5, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP1_2 = new Piece(this.scene, 1, this.gameBoard.tiles[4][1], 0, 6, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP1_3 = new Piece(this.scene, 1, this.gameBoard.tiles[5][1], 0, 7, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP1_4 = new Piece(this.scene, 1, this.gameBoard.tiles[4][2], 0, 8, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);

    //Player2
    this.bigPieceP2_1 = new Piece(this.scene, 3, this.gameBoard.tiles[0][8], 1, 9, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.bigPieceP2_2 = new Piece(this.scene, 3, this.gameBoard.tiles[8][8], 1, 10, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.normalPieceP2_1 = new Piece(this.scene, 2, this.gameBoard.tiles[2][7], 1, 11, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.normalPieceP2_2 = new Piece(this.scene, 2, this.gameBoard.tiles[6][7], 1, 12, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP2_1 = new Piece(this.scene, 1, this.gameBoard.tiles[3][7], 1, 13, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP2_2 = new Piece(this.scene, 1, this.gameBoard.tiles[4][7], 1, 14, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP2_3 = new Piece(this.scene, 1, this.gameBoard.tiles[5][7], 1, 15, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);
    this.smallPieceP2_4 = new Piece(this.scene, 1, this.gameBoard.tiles[4][6], 1, 16, this, this.texturePiece1, this.texturePiece2, this.texturePieceSelected);

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

Board.prototype.initBoard = function() {

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            this.gameBoard.tiles[i][j].setPiece(null);
        }
    }
    //Player1   
    this.gameBoard.tiles[0][0].setPiece(this.bigPieceP1_1);
    this.gameBoard.tiles[8][0].setPiece(this.bigPieceP1_2);
    this.gameBoard.tiles[2][1].setPiece(this.normalPieceP1_1);
    this.gameBoard.tiles[6][1].setPiece(this.normalPieceP1_2);
    this.gameBoard.tiles[3][1].setPiece(this.smallPieceP1_1);
    this.gameBoard.tiles[4][1].setPiece(this.smallPieceP1_2);
    this.gameBoard.tiles[5][1].setPiece(this.smallPieceP1_3);
    this.gameBoard.tiles[4][2].setPiece(this.smallPieceP1_4);

    //Player2
    this.gameBoard.tiles[0][8].setPiece(this.bigPieceP2_1);
    this.gameBoard.tiles[8][8].setPiece(this.bigPieceP2_2);
    this.gameBoard.tiles[2][7].setPiece(this.normalPieceP2_1);
    this.gameBoard.tiles[6][7].setPiece(this.normalPieceP2_2);
    this.gameBoard.tiles[3][7].setPiece(this.smallPieceP2_1);
    this.gameBoard.tiles[4][7].setPiece(this.smallPieceP2_2);
    this.gameBoard.tiles[5][7].setPiece(this.smallPieceP2_3);
    this.gameBoard.tiles[4][6].setPiece(this.smallPieceP2_4);

}

Board.prototype.resetGame = function() {

    this.resetPieces();
    this.initBoard();
    this.resetAuxiliarBoard();
}

Board.prototype.resetPieces = function() {
    for (var i = 0; i < this.pieces.length; i++)
        this.pieces[i].tile = null;

    //Player1
    this.bigPieceP1_1.tile = this.gameBoard.tiles[0][0];
    this.bigPieceP1_2.tile = this.gameBoard.tiles[8][0];
    this.normalPieceP1_1.tile = this.gameBoard.tiles[2][1];
    this.normalPieceP1_2.tile = this.gameBoard.tiles[6][1];
    this.smallPieceP1_1.tile = this.gameBoard.tiles[3][1];
    this.smallPieceP1_2.tile = this.gameBoard.tiles[4][1];
    this.smallPieceP1_3.tile = this.gameBoard.tiles[5][1];
    this.smallPieceP1_4.tile = this.gameBoard.tiles[4][2];

    //Player2
    this.bigPieceP2_1.tile = this.gameBoard.tiles[0][8];
    this.bigPieceP2_2.tile = this.gameBoard.tiles[8][8];
    this.normalPieceP2_1.tile = this.gameBoard.tiles[2][7];
    this.normalPieceP2_2.tile = this.gameBoard.tiles[6][7];
    this.smallPieceP2_1.tile = this.gameBoard.tiles[3][7];
    this.smallPieceP2_2.tile = this.gameBoard.tiles[4][7];
    this.smallPieceP2_3.tile = this.gameBoard.tiles[5][7];
    this.smallPieceP2_4.tile = this.gameBoard.tiles[4][6];
}

Board.prototype.resetAuxiliarBoard = function() {

    this.IndexPlayer1 = 0;
    this.IndexPlayer2 = 0;

    for (var i = 0; i < this.lengthBoard; i++) {
        this.auxiliarBoardP1.tiles[i].setPiece(null);
        this.auxiliarBoardP2.tiles[i].setPiece(null);
    }
}

Board.prototype.remove = function(oldcol, oldrow) {
    var origin = this.gameBoard.tiles[oldcol][oldrow];
    var piece = this.gameBoard.tiles[oldcol][oldrow].getPiece();
    var player = piece.player;
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
    var x = position.x;
    var y = position.y;

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

Board.prototype.disabledPlayer = function(player) {

    for (var i = 0; i < this.pieces.length; i++) {
        if (this.pieces[i].player == player)
            this.pieces[i].disableselection();
        else
            this.pieces[i].enableselection();
    }
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
    var move;
    var forcePiece = piece.height;
    var distMove = null;
    var deslocation;

    if (forcePiece < piecesLine.length) {
        move = false;
        emptySpaces = this.countEmptySpaces(piece, piecesLine[piecesLine.length - 1]);
    } else
        move = true;

    for (var i = piecesLine.length - 1; i >= 0; i--) {
        var emptySpacesNext = this.countEmptySpaces(piece, piecesLine[i]);
        var spaceToPiece = emptySpaces - emptySpacesNext;

        if (!move) {
            emptySpaces = emptySpacesNext;

            if (i > forcePiece) {
                continue;
            }

            if (i == forcePiece) {
                move = true;
                distMove = 0;
            }
        } else {
            if (emptySpacesNext >= dist) {
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

            if (distMove != null) {
                distMove += spaceToPiece;
                deslocation = Math.min(distMove, dist - emptySpacesNext);
            } else
                deslocation = dist - emptySpacesNext;

            if (deslocation > distBoar) {
                this.remove(pointXPiece, pointYPiece);
                continue;
            }

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
    }
    if (emptySpaces != 0 && deslocation == 0)
        return emptySpaces;

    if (emptySpaces > 0 && deslocation > 0)
        return deslocation;

    if (deslocation == 0)
        return -1;
    return null;
}

Board.prototype.updatePlayingTime = function(dtime) {

    if (this.reset) {
        console.debug('reset');
        this.reset = false;
        this.resetGame();
        this.video = true;

    }
    if (this.video) {
        this.second += dtime;
        if (this.second >= 1) {
            this.videoGame(this.IndexPlayed);
            this.second = 0;
        }
    } else {
        this.clock.updateTime(dtime);
        if (this.clock.timer < 0) {
            this.clock.timer = this.scene.playingTime;
            this.playerWaiting++;
            this.playerWaiting %= 2;
            this.disabledPlayer(this.playerWaiting);
            console.debug('mudou');
            this.disableSelectionAllTiles(null);
            this.noSelectAllPieces(null);
        }
    }
}

Board.prototype.videoGame = function(indexPlayed) {

    if (indexPlayed >= this.plays.length)
        return;
    console.debug('vide0');

    this.noSelectAllTiles(null);
    this.disableSelectionAllTiles(null);
    this.noSelectAllPieces(null);



    var moveVector = this.plays[indexPlayed].moveVector;
    var piecePoint = this.plays[indexPlayed].oldPosition;
    var newPoint = this.plays[indexPlayed].newPosition;
    var piece = this.plays[indexPlayed].piece;

    var piecesLine = this.piecesLine(piecePoint, moveVector);
    var move = this.makeMove(moveVector, piece, piecesLine);

    this.gameBoard.move(piecePoint.x, piecePoint.y, newPoint.x, newPoint.y);

    this.IndexPlayed++;
    console.debug('fimvide0');

}
Board.prototype.display = function() {

    this.gameBoard.display();
    this.scene.clearPickRegistration();
    this.auxiliarBoardP1.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 11.3, 0);
    this.auxiliarBoardP2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(12, 5, 0);
    this.clock.display();
    this.scene.popMatrix();
}