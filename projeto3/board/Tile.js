/**
 * Tile
 * @constructor
 */

function Tile(scene, id, piece, materialPlace, materialSelectable, board, point) {
    CGFobject.call(this, scene);

    this.point = point;
    this.board = board;
    this.scene = scene;
    this.id = id;
    this.place = new Plane(this.scene, 1, 1, 1, 1);
    this.piece = piece;
    this.selected = false;
    this.selectable = false;
    this.visible = true;

    this.materialPlace = materialPlace;
    this.materialSelectable = materialSelectable;

};

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.setPiece = function(piece) {
    this.piece = piece;
}


Tile.prototype.select = function() {

    this.selected = !this.selected;
    this.board.noSelectAllTiles(this.id);
    var pieceSelect = this.board.getPieceSelected();
    var picePoint = pieceSelect.tile.point;
    var distX = (this.point.x - picePoint.x);
    var distY = (this.point.y - picePoint.y);

    var moveVector = new Point2(distX, distY);

    var piecesLine = this.board.piecesLine(picePoint, moveVector);

    var move = this.board.makeMove(moveVector, pieceSelect, piecesLine);

    if (move == null) {
        this.board.gameBoard.move(picePoint.x, picePoint.y, this.point.x, this.point.y);
        this.board.plays.push(new Played(pieceSelect, picePoint, this.point.x, this.point.y));

    } else if (move != -1) {
        if (distX)
            if (distX > 0) {
                this.board.gameBoard.move(picePoint.x, picePoint.y, picePoint.x + move, picePoint.y);
                this.board.plays.push(new Played(pieceSelect, picePoint, picePoint.x + move, picePoint.y));
            } else {
                this.board.gameBoard.move(picePoint.x, picePoint.y, picePoint.x - move, picePoint.y);
                this.board.plays.push(new Played(pieceSelect, picePoint, picePoint.x - move, picePoint.y));
            }

        if (distY)
            if (distY > 0) {
                this.board.gameBoard.move(picePoint.x, picePoint.y, picePoint.x, picePoint.y + move);
                this.board.plays.push(new Played(pieceSelect, picePoint, picePoint.x, picePoint.y + move));
            } else {
                this.board.gameBoard.move(picePoint.x, picePoint.y, picePoint.x, picePoint.y - move);
                this.board.plays.push(new Played(pieceSelect, picePoint, picePoint.x, picePoint.y - move));
            }
    }

    this.board.disableSelectionAllTiles();
    this.board.noSelectAllPieces(null);

    if (move != -1) {
        this.board.gameBoard.countPoints(this.board.playerWaiting);

        this.board.playerWaiting++;
        this.board.playerWaiting %= 2;

        this.board.gameBoard.countPoints(this.board.playerWaiting);

        this.board.disabledPlayer(this.board.playerWaiting);
        this.board.clock.timer = this.scene.playingTime;

        this.board.IndexPlayed++;
    }
    // if (this.board.plays.length > 5)
    //   this.board.reset = true;

}

Tile.prototype.noSelect = function() {
    this.selected = false
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

Tile.prototype.getPoint = function() {
    return this.point;
}

Tile.prototype.display = function() {

    if (this.visible) {
        this.scene.pushMatrix();

        if (this.selectable)
            this.scene.registerForPick(this.id, this);

        if (this.selectable)
            this.materialSelectable.apply();
        else
            this.materialPlace.apply();

        if (this.piece != null)
            this.piece.display();


        this.place.display();

        this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }
}