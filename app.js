var gameBoard;
var gameBoardDOM = document.querySelector('#gameboard');
var aiMove;
var maxDepth = 4;
var playerTurn = true;
var userRows;
var userColumns;

// var winningCombinations = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6]
// ];

var winningCombinations = generateWinningCombinations(5, 5);

function generateWinningCombinations(rows, columns) {
  var container = [];
  var temp = [];
  for (var i = 0; i < rows; i++) {
    temp.push(i);
  }
  container.push(temp);

  for (var j = 0; j < columns - 1; j++) {
    container.push(temp.map(function(element) {
      return element + rows;
    }));
    rows += 5;
  }
  cellinc = 0;
  var incre = 0;
  temp = [];
  temp = container.map(function(element) {
    return container.map(function(cell) {
      var ret = cell[cellinc] + incre;
      incre + 5;
      return ret;
    });
  });
  console.log(temp);
  return container;
}

function generateGrid(dimension) {
  //normal way:

  gameBoard = new Array(25);
  for (var i = 0; i < 25; i++) {
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
  for (var i = 0; i < 5; i++) {
    var row = document.createElement('tr');
    gameBoardDOM.appendChild(row);
    for (var j = 0; j < 5; j++) {
      var cell = document.createElement('td');
      cell.id = ids++;
      row.appendChild(cell);
    }
  }
}
drawGrid();
generateGrid();

function renderBoard() {
  for (var i = 0; i < 25; i++) {
    document.getElementById(i).innerHTML = gameBoard[i];
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
    length: 25
  }).map(Number.call, Number);
  return moves.filter(function(i) {
    return boardState[i] === '';
  });
}

function terminal(state) {
  return boardFull(state) || playerWins(state, 'X') || playerWins(state, 'O');
}

function aiAlgoScorer(boardState) {
  if (playerWins(boardState, 'X')) {
    return 10;
  } else if (playerWins(boardState, 'O')) {
    return -10;
  } else {
    return 0;
  }
}

function aiAlgo(boardState, player, depth) {
  if (depth >= maxDepth || terminal(boardState)) {
    return aiAlgoScorer(boardState);
  }

  var maxScore = 0;
  var minScore = 0;
  var scores = [];
  var moves = [];
  var opponent = (player === 'X') ? 'O' : 'X';
  var successors = getMoves(boardState);

  for (var s in successors) {
    var iteratedState = boardState;
    iteratedState[successors[s]] = player;
    scores.push(aiAlgo(iteratedState, opponent, depth + 1));
    iteratedState[successors[s]] = '';
    moves.push(successors[s]);
  }

  if (player === 'X') {
    aiMove = moves[0];
    maxScore = scores[0];
    for (var s in scores) {
      if (scores[s] > maxScore) {
        maxScore = scores[s];
        aiMove = moves[s];
      }
    }
    return maxScore;
  } else {
    aiMove = moves[0];
    minScore = scores[0];
    for (var s in scores) {
      if (scores[s] < minScore) {
        minScore = scores[s];
        aiMove = moves[s];
      }
    }
    return minScore;
  }
}

gameBoardDOM.addEventListener('click', function(event) {
  gameBoard[event.target.id] = 'X';
  aiAlgo(gameBoard, 'O', 0);
  console.log(aiMove);
  gameBoard[aiMove] = 'O';
  renderBoard();
});
