var originalBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
];

const cells = document.querySelectorAll('.cell')
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = 'none';
    originalBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
       cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn (squareID , player) {
    originalBoard[squareID] = player;
    document.getElementById(squareID).innerText = player;
    let gameWon =checkWon(originalBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWon(board, player) {
    let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}

function emptySquares() {
	return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(originalBoard, aiPlayer).index;
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
    var availspots = emptySquares(newBoard);

    if (checkWon(newBoard, humanPlayer)) {
        return {score: -10}
    } else if (checkWon(newBoard, aiPlayer)){
        return {score: 10 }
    } else if (availspots.length === 0) {
        return {score: 0}
    }
    var moves = [];
    for (var i = 0; i < availspots.length; i++) {
        var move = {};
        move.index = newBoard[availspots[i]];
        newBoard[availspots[i]] = player;

        if (player == aiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availspots[i]] = move.index;

		moves.push(move);
    }

    var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}