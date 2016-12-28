/* Oshi game interface */

oshi :- 
	write('Welcome to Oshi!\n'),
	chooseGameMode.
	
chooseGameMode :-
	write('There are 4 game modes you can choose:\n'),
	write('1. Player vs Player;\n'),
	write('2. Player vs AI (easy);\n'),
	write('3. AI vs AI;\n'),
	write('Please choose one of the game modes listed above: '),
	read(GM),
	nl,
	startGame(GM).

startGame(GM):-
	GM >= 1,
	GM =< 3,
	default_board(B),
	!,
	game(GM,B,0).
startGame(GM):-
	write('Option '),
	write(GM),
	write(' is not a valid game mode!\n'),
	chooseGameMode.

game(GM,B,TURN):-
	PL is mod(TURN,2),
	display_board(B),
	game_status(B),
	check_game(B),
	game_turn(PL),
	repeat,
	turn(GM,B,PL,PR,PC,D,N,P),
	check_move(B,PR,PC,N,D),
	!,
	move(B,PR,PC,N,D,NB),
	NT is TURN + 1,
	game(GM,NB,NT).
game(_,B,_):-
	write('End of game!\n').

turn(GM,B,PL,PR,PC,D,N,P):-
	GM = 1,
	askForPiece(B,PR,PC,P,PL),
	askForMove(D,N,P).
turn(GM,B,PL,PR,PC,D,N,P):-
	GM = 2,
	PL = 0,
	askForPiece(B,PR,PC,P,PL),
	askForMove(D,N,P).
turn(GM,B,PL,PR,PC,D,N,P):-
	GM = 2,
	PL = 1,
	randomPiece(B,PR,PC,P,PL),
	randomMove(D,N,P).
turn(GM,B,PL,PR,PC,D,N,P):-
	GM = 3,
	randomPiece(B,PR,PC,P,PL),
	randomMove(D,N,P).

game_status(B):-
	count_points_white(B,W),
	count_points_red(B,R),
	write('Points (White - '),
	write(W),
	write(') (Red - '),
	write(R),
	write(')\n').

game_turn(PL):-
	PL \= 0,
	write('Red\'s turn\n').
game_turn(PL):-
	PL = 0,
	write('White\'s turn\n').

check_game(B):-
	check_white(B),
	check_red(B).

check_white(B):-
	count_points_red(B,C),
	C >= 7.
check_white(_):-
	write('White wins, congrats!\n'),
	fail.

check_red(B):-
	count_points_white(B,C),
	C >= 7.
check_red(_):-
	write('Red wins, congrats!\n'),
	fail.


askForPiece(B,PR,PC,P,PL):-
	repeat,
	askForRow(PR),
	askForCol(PC),
	return_position(B,PR,PC,P),
	PL1 is P//4,
	(P \= 0, PL1 = PL),
	!.

askForRow(PR):-
	repeat,
	write('Choose Row of Piece to move (1 to 9): '),
    read(PR),
	(PR < 10, PR > 0),
	!.

askForCol(PC):-
	repeat,
	write('Choose Collumm of Piece to move (1 to 9): '),
    read(PC),
	(PC < 10, PC > 0),
	!.

askForMove(D,N,P):-
	askForDirection(D),
	askForNumMoves(N,P).

askForDirection(D):-
	repeat,
	write('Directions:\n'),
	write('0. Right;\n'),
	write('1. Left;\n'),
	write('2. Down;\n'),
	write('3. Up;\n'),
	write('Choose in which direction you want to move: '),
	read(D),
	(D>=0,D=<3),
	!.

askForNumMoves(N,P):-
	repeat,
	write('Choose the number of blocks you want to move: '),
	read(N),
	(N=<mod(P,4)),
	!.