var gameBoard;
var gameBoardDOM = document.querySelector('#gameboard');
var aiMove;
var maxDepth = 6;
var playerTurn = true;

var winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function generateGrid(dimension) {
  //normal way:

  gameBoard = new Array(9);
  for (var i = 0; i < 9; i++) {
    gameBoard[i] = '';
  }
  //hipster way:
  // gameBoard = Array.apply(null, {
  //   length: 9
  // }).map(function(element, index) {
  //   element = ' ';
  //   return element;
  // });
}

function drawGrid(rows, columns) {
  var ids = 0;
  for (var i = 0; i < 3; i++) {
    var row = document.createElement('tr');
    gameBoardDOM.appendChild(row);
    for (var j = 0; j < 3; j++) {
      var cell = document.createElement('td');
      cell.id = ids++;
      row.appendChild(cell);
    }
  }
}
drawGrid();
generateGrid();

function renderBoard() {
  for (var j = 0; j < 9; j++) {
    document.getElementById(j).innerHTML = gameBoard[j];
  }
}

function playerWins(state, token) {
  var win;
  for (var i = 0; i < winningCombinations.length; i++) {
    win = true;
    for (var j = 0; j < winningCombinations[i].length; j++) {
      if (state[winningCombinations[i][j]] !== token) {
        win = false;
      }
    }
    if (win) {
      return true;
    }
  }
  return false;
}

function boardFull(boardState) {
  // console.log(getMoves(boardState).length);
  return !getMoves(boardState).length;
}


function getMoves(boardState) {
  var moves = Array.apply(null, {
  length: 9
}).map(Number.call, Number);
return moves.filter(function(i) {
  return boardState[i] === '';
});}

function terminal(state) {
  return boardFull(state) || playerWins(state, "X") || playerWins(state, "O");
}


function aiAlgoScorer(boardState) {
  if (playerWins(boardState, "X")) {
    return 10;
  } else if (playerWins(boardState, "O")) {
    return -10;
  } else {
    return 0;
  }
}

function aiAlgo(boardState, player, depth) {
  //terminating the recursion cases:
  if (depth >= maxDepth || terminal(boardState)) {
    return aiAlgoScorer(boardState);
  }

  var max_score,
    min_score,
    scores = [],
    moves = [],
    opponent = (player == "X") ? "O" : "X",
    successors = getMoves(boardState);

  for (var s in successors) {
    var possible_state = boardState;
    possible_state[successors[s]] = player;
    scores.push(aiAlgo(possible_state, opponent, depth + 1));
    possible_state[successors[s]] = '';
    moves.push(successors[s]);
  }

  if (player == "X") {
    aiMove = moves[0];
    max_score = scores[0];
    for (var s in scores) {
      if (scores[s] > max_score) {
        max_score = scores[s];
        aiMove = moves[s];
      }
    }
    return max_score;
  } else {
    aiMove = moves[0];
    min_score = scores[0];
    for (var s in scores) {
      if (scores[s] < min_score) {
        min_score = scores[s];
        aiMove = moves[s];
      }
    }
    return min_score;
  }
}

gameBoardDOM.addEventListener('click', function(event) {
  gameBoard[event.target.id] = 'X';

  console.log(aiMove);
  aiAlgo(gameBoard, 'O', 0);
  gameBoard[aiMove] = 'O';
  renderBoard();
});
