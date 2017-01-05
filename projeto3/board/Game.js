/**
 * Game
 * @constructor
 */
function Game(id, scene) {
    this.id = id;
    this.time = 0;
    this.gameMode = 'none';
    this.state = Game.GameState.Menu;
    this.board = [];
    this.redPoints = 0;
    this.whitePoints = 0;
    this.client = new Client();
    this.scene = scene;
}

Game.prototype.constructor = Game;

Game.prototype.getNewBoard = function() {
    var boardTemp = this.client.sendRequest("newBoard");
    this.setBoard(boardTemp);
}

Game.prototype.setBoard = function(boardTemp) {
    console.debug(boardTemp);
    this.board = JSON.parse(boardTemp);
}

Game.prototype.begin = function() {
    this.getNewBoard();
    this.scene.graph.board.resetGame();
}

Game.prototype.stop = function() {
    this.state = Game.GameState.End;
}

Game.prototype.getRedPoints = function() {
    var tempPoints = this.client.sendRequest("redPoints(" + boardToString(this.board) + ")");
    this.redPoints = tempPoints;
}

Game.prototype.getWhitePoints = function() {
    var tempPoints = this.client.sendRequest("whitePoints(" + boardToString(this.board) + ")");
    this.redPoints = tempPoints;
}

Game.prototype.shutdown = function() {
    console.log(this.client.sendRequest("quit"));
}

Game.prototype.move = function(Xi, Yi, Xf, Yf) {
    var board = boardToString(this.board);
    var dir = 0;
    var dy = Yf - Yi;
    var dx = Xf - Xi;
    var Num = 0;
    if (dy > 0) {
        dir = 2;
        Num = dy;
    }
    if (dy < 0) {
        dir = 3;
        Num = Math.abs(dy);
    }
    if (dx > 0) {
        dir = 0;
        Num = dx;
    }
    if (dx < 0) {
        dir = 1;
        Num = Math.abs(dx);
    }
    var x = Xi + 1;
    var y = Yi + 1;
    var message = "move(" + board + "," + x + "," + y + "," + dir + "," + Num + ")";
    var boardTemp = this.client.sendRequest(message);
    if (boardTemp != "invalid") {
        this.setBoard(boardTemp);
        return true;
    }
    return false;
}

Game.GameState = {
    Menu: 0,
    WhiteMove: 1,
    RedMove: 2,
    End: 3
}

Game.GameMode = {
    PvP: 0,
    PvAI: 1,
    AIvAI: 2
}