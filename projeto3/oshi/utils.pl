/* Utility_functions */


/* Check position */

return_position(B,R,C,POS):-
	return_positionAuxR(B,R,C,1,POS).
	
return_positionAuxR([H|T],R,C,NR,POS) :-
	NR \= R,
	NR1 is NR +1,
	!,
    return_positionAuxR(T,R,C,NR1,POS).
return_positionAuxR([H|T],R,C,NR,POS):-
	NR = R,
	!,
    return_positionAuxC(H,C,1,POS).

return_positionAuxC([H|T],C,NC,POS):-
	C\= NC,
	NC1 is NC+1,
	!,
	return_positionAuxC(T,C,NC1,POS).
return_positionAuxC([H|T],C,NC,POS):-
	C = NC,
	reportPosition(H,POS).
		
reportPosition(H,POS) :-
	POS is H.


/* Check Piece at location */

validate_move(B,PR,PC,TR,TC):-
	return_position(B,PR,PC,T),
	check_piece(T,PR,PC,TR,TC).

check_piece(T,PR,PC,TR,TC):-
	T = 0,
	write('Not a valid piece location').
check_piece(T,PR,PC,TR,TC):-
	mod(T,4) = 1,
	write('1 block piece'),
	valid_location(1,PR,PC,TR,TC).	
check_piece(T,PR,PC,TR,TC):-
	mod(T,4) = 2,
	write('2 blocks piece'),
	valid_location(2,PR,PC,TR,TC).
check_piece(T,PR,PC,TR,TC):-
	mod(T,4) = 3,
	write('3 blocks piece'),	
	valid_location(3,PR,PC,TR,TC).

valid_location(V,PR,PC,TR,TC):-
	PR = TR,
	valid_locationAux(V,PC,TC).		
valid_location(V,PR,PC,TR,TC):-
	PC = TC,
	valid_locationAux(V,PR,TR).		
valid_locationAux(V,A1,A2):-
	A3 is A1 - A2,
	abs(A3) < V+1,
	nl,
	write('valid movement').

/* Check move */

check_move(B,R,C,N,D):-
	(D >= 0 , D < 2),
	D1 is mod(D,2),
	!,
	check_horizontal(B,R,C,N,D1). %direction horizontal

check_move(B,R,C,N,D):-
	(D > 1, D < 4),
	D1 is mod(D,2),
	!,
	check_vertical(B,R,C,N,D1). %direction vertical

check_move(B,R,C,N,D):-
	fail.

check_horizontal(B,R,C,N,D):-
	D = 0,
	get_row(B,R,L),
	!,
	return_position(B,R,C,P),
	V is mod(P,4),
	check(L,C,V,N).
check_horizontal(B,R,C,N,D):-
	D = 1,
	get_row(B,R,L),
	reverse_list(L,L1),
	!,
	return_position(B,R,C,P),
	V is mod(P,4),
	check(L1,C,V,N).

check_vertical(B,R,C,N,D):-
	D = 0,
	get_col(B,C,L),
	!,
	return_position(B,R,C,P),
	V is mod(P,4),
	check(L,R,V,N).
check_vertical(B,R,C,N,D):-
	D = 1,
	get_col(B,C,L),
	reverse_list(L,L1),
	!,
	return_position(B,R,C,P),
	V is mod(P,4),
	check(L1,R,V,N).

check(L,P,V,N):-
	N1 is N + V,
	check(L,P,V,N1,1).
check([],_,_,_,_).
check([H|T],P,V,N,I):-
	I =< P,
	I1 is I + 1,
	!,
	check(T,P,V,N,I1).
check([H|T],P,V,N,I):-
	N > 0,
	N1 is N-1,
	V1 is V - abs(sign(H)),
	V1 >= 0,
	!,
	check(T,P,V1,N1,I).
check([H|T],P,V,N,I):-
	N =< 0.

/* Move */

move(B,PR,PC,N,D,NB):-
	D1 is D//2,
	D1 = 0,
	D2 is mod(D,2),
	return_position(B,PR,PC,V),
	V1 is V + 1,
	move_horizontal(B,PR,PC,N,V1,D2,NB).
move(B,PR,PC,N,D,NB):-
	D1 is D//2,
	D1 = 1,
	D2 is mod(D,2),
	return_position(B,PR,PC,V),
	V1 is V + 1,
	move_vertical(B,PR,PC,N,V1,D2,NB).
move(B,PR,PC,N,D,NB):-
	write('Invalid direction\n'),
	fail.

move_horizontal(B,PR,PC,N,V,D,NB):-
	D = 0,
	get_row(B,PR,L),
	move_aux(L,PC,N,V,NL),
	set_row(B,PR,NL,NB).
move_horizontal(B,PR,PC,N,V,D,NB):-
	D = 1,
	get_row(B,PR,L),
	reverse_list(L,L1),
	PC1 is 10 - PC,
	move_aux(L1,PC1,N,V,NL),
	reverse_list(NL,FL),
	set_row(B,PR,FL,NB).

move_vertical(B,PR,PC,N,V,D,NB):-
	D = 0,
	get_col(B,PC,L),
	move_aux(L,PR,N,V,NL),
	set_col(B,PC,NL,NB).
move_vertical(B,PR,PC,N,V,D,NB):-
	D = 1,
	get_col(B,PC,L),
	reverse_list(L,L1),
	PR1 is 10 - PR,
	move_aux(L1,PR1,N,V,NL),
	reverse_list(NL,FL),
	set_col(B,PC,FL,NB).

move_aux(L,P,0,V,L).
move_aux(L,P,N,V,NL):-
	N>0,
	N1 is N - 1,
	move_aux(L,P,V,NL1,1,0),
	P1 is P + 1,
	move_aux(NL1,P1,N1,V,NL).
move_aux([H|T],P,N,[H|T1],I,NE):-
	I \= P,
	I1 is I + 1,
	move_aux(T,P,N,T1,I1,NE).
move_aux([H|T],P,N,[NE|T1],I,NE):-
	I=P,
	P1 is P + sign(H),
	I1 is I + 1,
	move_aux(T,P1,N1,T1,I1,H).
move_aux([],_,_,[],_,_).
	
/* Set row and collumn */	

set_row(B,P,R,NB):-
	set_row(B,P,R,NB,1).
set_row([],_,_,[],_).
set_row([H|T],P,R,[H|T1],I):-
	I\=P,
	I1 is I + 1,
	set_row(T,P,R,T1,I1).
set_row([H|T],P,R,[R|T1],I):-
	I1 is I + 1,
	set_row(T,P,R,T1,I1).

set_col([],_,_,[]).
set_col([H|T],P,[CH|CT],[H1|T1]):-
	set_col(H,P,CH,H1,1),
	set_col(T,P,CT,T1).
set_col([],_,_,[],_).
set_col([H|T],P,C,[H|T1],I):-
	I \= P,
	I1 is I + 1,
	set_col(T,P,C,T1,I1).
set_col([H|T],P,C,[C|T1],I):-
	I1 is I + 1,
	set_col(T,P,C,T1,I1).


/* Count pieces for each color */

count_total(B,C):-
	count_white(B,C1),
	count_red(B,C2),
	C is C1 + C2.

count_white(B,C):-
	count_pieces(B,4,0,C).

count_red(B,C):-
	count_pieces(B,8,0,C).

count_pieces([H|T],N,A,C):-
	count_pieces_aux(H,N,A,C1),
	!,
	count_pieces(T,N,C1,C).
count_pieces([],_,C,C).

count_pieces_aux([],_,C,C).
count_pieces_aux([H|T],N,A,C):-
	(H < N, H > N - 4),
	A1 is A+1,
	count_pieces_aux(T,N,A1,C).
count_pieces_aux([H|T],N,A,C):-
	count_pieces_aux(T,N,A,C).	

count_points_white(B,C):-
	count_points(B,4,0,C).

count_points_red(B,C):-
	count_points(B,8,0,C).

count_points([H|T],N,A,C):-
	count_points_aux(H,N,A,C1),
	!,
	count_points(T,N,C1,C).
count_points([],_,C,C).

count_points_aux([],_,C,C).
count_points_aux([H|T],N,A,C):-
	(H < N, H > N - 4),
	V is mod(H,4),
	A1 is A+V,
	count_points_aux(T,N,A1,C).
count_points_aux([H|T],N,A,C):-
	count_points_aux(T,N,A,C).

randomPiece(B,PR,PC,P,PL):-
	repeat,
	random(1,10,PR),
	random(1,10,PC),
	return_position(B,PR,PC,P),
	PL1 is P//4,
	(P \= 0, PL1 = PL),
	!.
randomMove(D,N,P):-
	randomDirection(D),
	randomNumMoves(N,P).

randomDirection(D):-
	random(0,4,D).

randomNumMoves(N,P):-
	V is mod(P,4) + 1,
	random(1,V,N).

/* Reverse list */

reverse_list(IL,OL):-
	reverse(IL,[],OL).    

reverse([],OL,OL).
reverse([H|T],L1,L2):-
	reverse(T,[H|L1],L2).

/* this is trash so far */

/*
checkSurroundings(B, R, C, P) :-
    R1 is R + 1,
    R2 is R - 1,
    C1 is C + 1,
    C2 is C - 1,
    checkNotAdjacentAuxL(B, R1, C, P, 1),
    checkNotAdjacentAuxL(B, R2, C, P, 1),
    checkNotAdjacentAuxL(B, R, C1, P, 1),
    checkNotAdjacentAuxL(B, R, C2, P, 1).

checkAdjacentFreeSpace(B, R, C) :-
    R1 is R + 1,
    getCoord(B, R1, C, X),
    checkSpot(X, 0).
checkAdjacentFreeSpace(B, R, C) :-
    R2 is R - 1,
    getCoord(B, R2, C, X),
    checkSpot(X, 0).
checkAdjacentFreeSpace(B, R, C) :-
    C1 is C + 1,
    getCoord(B, R, C1, X),
    checkSpot(X, 0).
checkAdjacentFreeSpace(B, R, C) :-
    C2 is C - 1,
    getCoord(B, R, C2, X),
    checkSpot(X, 0).	
*/
	
	
		

	
/* in dev still */

/*	
getCoord(B, C, L, X) :-
    getCoordR(B, C, L, X, 1).

getCoordR([], C, L, [-1, -1], NL).
getCoordR([H|T], C, L, [-1, -1], NL) :-
    L = 0, !.
getCoordR([H|T], C, L, [-1, -1], NL) :-
    C = 0, !.
getCoordR([H|T], C, L, X, NL) :-
    NL \= L,
    NL1 is NL + 1,
    getCoordR(T, C, L, X, NL1).
getCoordR([H|T], C, L, X, NL) :-
    NL = L,
    getCoordL(H, C, X, 1).

getCoordL([], C, [-1, -1], NC).
getCoordL([H|T], C, X, NC) :-
    C \= NC,
    NC1 is NC+1,
    getCoordL(T, C, X, NC1).
getCoordL([H | T], C, X, NC) :-
    C = NC,
    getPointP(H, X).

getPointP([P, G], [P, G]). */