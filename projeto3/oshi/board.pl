/* Board creation and display */

%Pieces

%e
piece_empty([
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ']
    ]).

%w1
white_small([
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ','W',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ']]).

%w2
white_medium([
    [' ',' ',' ',' ',' '],
    [' ','W','W','W',' '],
    [' ','W','W','W',' '],
    [' ','W','W','W',' '],
    [' ',' ',' ',' ',' ']]).

%w3
white_big([
    ['W','W','W','W','W'],
    ['W','W','W','W','W'],
    ['W','W','W','W','W'],
    ['W','W','W','W','W'],
    ['W','W','W','W','W']]).

%r1
red_small([
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ','R',' ',' '],
    [' ',' ',' ',' ',' '],
    [' ',' ',' ',' ',' ']]).

%r2
red_medium([
    [' ',' ',' ',' ',' '],
    [' ','R','R','R',' '],
    [' ','R','R','R',' '],
    [' ','R','R','R',' '],
    [' ',' ',' ',' ',' ']]).

%r3
red_big([
    ['R','R','R','R','R'],
    ['R','R','R','R','R'],
    ['R','R','R','R','R'],
    ['R','R','R','R','R'],
    ['R','R','R','R','R']]).

%Boards

default_board([
    [3,0,0,0,0,0,0,0,3],
    [0,0,2,1,1,1,2,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,5,0,0,0,0],
    [0,0,6,5,5,5,6,0,0],
    [7,0,0,0,0,0,0,0,7]]).

%Create Board

new_board(H):- create_board(H,9).

create_board(H,N):-
            length(H,9),
            create_rows(H).

create_rows([]).
create_rows([H|T]):-
            length(H,9),
            create_pieces(H),
            create_rows(T).

create_pieces([]).
create_pieces([H|T]):-
            H is 0,
            create_pieces(T).

%Change piece

set_piece(B,R,C,P,NB).

set_piece_row([H|T],R,C,P,[H|T]):-
            R > 0,
            R1 is R-1,
            set_piece_row(T,R1,C,P,T).
set_piece_row([H|T],R,C,P,[H|T]):-
            set_piece_col(H,C,P).
set_piece_col([H|T],C,P):-
            C > 0,
            C1 is C-1,
            set_piece_col(T,R,C1,P).
set_piece_col([H|T],C,P):-
            set_piece_aux(H,P).
set_piece_aux(H,P):-
            H is P.

get_col([],_,[]).
get_col([H|T],CP,[CH|CT]):-
    get_col(H,CP,CH,1),
    !,
    get_col(T,CP,CT).

get_col([],_,_,_).
get_col([H|T],CP,C,N):-
    N \= CP,
    N1 is N + 1,
    get_col(T,CP,C,N1).
get_col([H|T],CP,C,N):-
    N = CP,
    C is H.

get_row([],_,[]).
get_row(B,RP,R):-
    get_row(B,RP,R,1).
get_row([],_,_,_).
get_row([H|T],RP,R,N):-
    N \= RP,
    N1 is N + 1,
    !,
    get_row(T,RP,R,N1).
get_row([H|T],RP,H,N).

%Set Board

%Display Board

display_board([]).
display_board(H):-
            display_line(73),
            display_board_aux(H).

display_board_aux([]).
display_board_aux([H|T]):-
            display_board_row(H,1),!,
            display_board_aux(T).

display_board_row(H,N):-
            N < 6,
            display_board_row_aux(H,N),
            write('|'),
            nl,
            N1 is N+1,
            display_board_row(H,N1).
display_board_row(H,N):-
            display_line(73).

display_board_row_aux([],N).
display_board_row_aux([H|T],N):-
            H = 1,
            white_small(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 2,
            white_medium(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 3,
            white_big(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 5,
            red_small(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 6,
            red_medium(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 7,
            red_big(P),
            display_piece(P,N),
            display_board_row_aux(T,N).
display_board_row_aux([H|T],N):-
            H = 0,
            piece_empty(P),
            display_piece(P,N),
            display_board_row_aux(T,N).

display_piece([],N).
display_piece(P,N):-
            nth1(N,P,R), 
            write('| '),
            display_piece_line(R),
            write(' ').

display_piece_line([]).
display_piece_line([H|T]):- 
            write(H), 
            display_piece_line(T).

display_line(N):-
            N<1,
            nl.
display_line(N):-
            N>0,
            N1 is N-1, 
            write('-'), 
            display_line(N1).