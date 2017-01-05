/**
 * Game
 * @constructor
 */
function Game(id) {
    this.id = id;
    this.time = 0;
    this.gameMode = 'none';
    this.state = Game.GameState.Menu;
    this.board = [];
    this.redPoints = 0;
    this.whitePoints = 0;
    this.client = new Client();
}

Game.prototype.constructor = Game;

Game.prototype.getNewBoard = function () {
    var boardTemp = this.client.sendRequest("newBoard");
    this.board = JSON.parse(boardTemp);
}

Game.prototype.begin = function () {
    this.getNewBoard();
}

Game.prototype.stop = function () {
    this.state = Game.GameState.End;
}

Game.prototype.getRedPoints = function () {
    var tempPoints = this.client.sendRequest("redPoints(" + boardToString(this.board) + ")");
    this.redPoints = tempPoints;
}

Game.prototype.getWhitePoints = function () {
    var tempPoints = this.client.sendRequest("whitePoints(" + boardToString(this.board) + ")");
    this.redPoints = tempPoints;
}

Game.prototype.shutdown = function () {
    console.log(this.client.sendRequest("quit"));
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