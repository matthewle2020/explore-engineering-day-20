/*
 *  Matthew Le
 *  explore-engineering-day-20
 */

var player = 'X';
var computer = 'O';
var myTurn = false;
var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

resetBoard();
main();

function main(){
    $(".col-xs-3").click(function() {     
        if ( $(this).is(':empty') ){
            var cell = $(this).attr("id");
            var row = parseInt(cell[1]);
            var col = parseInt(cell[2]);
            if (!myTurn) {
                board[row][col] = false;
                myTurn = true;                
                newMove();                                     
                computerMove();                     
            }
        }  
    });
}

// checks for win condition
function checkWin(board) {
    vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];
        var diagonal1Complete = true;
        var diagonal2Complete = true;
        //checks diagonals
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonal1Complete = false;
            }
            if (board[2 - i][i] != value) {
                diagonal2Complete = false;
            }
            //checks rows and cols
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] === null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonal1Complete || diagonal2Complete) {
            return value ? 1 : 0;
        }       
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}

// resets game
function resetBoard() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    myTurn = false;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
                $("#" + "b" + i + "" +j).text("").css("background","dimgrey");
        }
    }
    $('h3').css("display","none").text("");
}

// checks for winner after each move
function newMove() { 
    drawBoard();
    var winner = checkWin(board);
    if(winner === 1){
        $('h3').css("display","block").append("Computer AI Won!").addClass("animated bounceIn");
        drawWin();
        //displays the result for 2 seconds before the game resets
        setTimeout(resetBoard, 2000);
    }
    else if(winner === 0){
        $('h3').css("display","block").append('You Won!').addClass("animated bounceIn");
        drawWin();
        setTimeout(resetBoard, 2000);
    }
    else if(winner === -1){
        $('h3').css("display","block").append("It's a Tie!").addClass("animated bounceIn");
        setTimeout(resetBoard, 2000);
    }
    
}

// updates board view after each move
function drawBoard() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if( board[i][j] === false && $("#"+"b"+i+""+j).is(':empty') ){
                $("#" + "b" + i + "" +j).text(player);
            }
            else if( board[i][j] === true && $("#"+"b"+i+""+j).is(':empty') ){
                $("#" + "b" + i + "" +j).text(computer);
            }
        }
    }
}

// marks the winning straight if win
function drawWin(){
    var straights = [ [1,2,3],[4,5,6],[7,8,9],
                    [1,4,7],[2,5,8],[3,6,9],
                    [1,5,9],[3,5,7] ];
    for( var i=0; i<straights.length; i++ ){
        if( $('.'+'b'+straights[i][0]+':contains("O")').length > 0 && $('.'+'b'+straights[i][1]+':contains("O")').length > 0 && $('.'+'b'+straights[i][2]+':contains("O")').length > 0 ){ 
            $('.'+'b'+straights[i][0]).css("background","#e87500");
            $('.'+'b'+straights[i][1]).css("background","#e87500");
            $('.'+'b'+straights[i][2]).css("background","#e87500");
            i=straights.length;
        } 
    }
    for( var j=0; j<straights.length; j++ ){
        if( $('.'+'b'+straights[j][0]+':contains("X")').length > 0 && $('.'+'b'+straights[j][1]+':contains("X")').length > 0 && $('.'+'b'+straights[j][2]+':contains("X")').length > 0 ){ 
            $('.'+'b'+straights[j][0]).css("background","#e87500");
            $('.'+'b'+straights[j][1]).css("background","#e87500");
            $('.'+'b'+straights[j][2]).css("background","#e87500");
            j=straights.length;
        }
    }
    return;
}

// recursive minimax algorithm
function minimax(board, player) {
    nodes++;
    // check if winner for future boards
    var winner = checkWin(board);
    if (winner !== null) {
        switch(winner) {
            case 1:
                // AI wins (heuristic: +1)
                return [1, board];
            case 0:
                // Player wins (heuristic: -1)
                return [-1, board];
            case -1:
                // Tie (heuristic: +/-0)
                return [0, board];
        }
    } 
    else {
        // next game states
        var nextVal = null;
        var nextBoard = null;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    board[i][j] = player;
                    // recurse down game tree
                    var value = minimax(board, !player)[0]; 
                    // perform minimizer/maximizer
                    // TO DO: implement alpha-beta pruning (not necessary for 3x3 board)
                    if ((player && (nextVal === null || value > nextVal)) || (!player && (nextVal === null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    // reset game state
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}

// initial minimax call
function minimaxMove(board) {
    nodes = 0;
    return minimax(board, true)[1]; 
}

// AI move
function computerMove() {
    board = minimaxMove(board);
    myTurn = false;
    if( nodes !== 1 ){
        newMove();
    }   
}