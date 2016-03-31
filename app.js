document.addEventListener('DOMContentLoaded', function() {
  var gameBoard;
  var gameBoardDOM = document.querySelector('#gameboard');
  var aiMove;
  var maxDepth = 6;
  var allowAction = true;
  var gameRunning = false;
  var winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  function generateGrid(dimension) {
    gameBoard = new Array(9);
    for (var i = 0; i < 9; i++) {
      gameBoard[i] = '';
    }
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
  function renderBoard() {
    for (var i = 0; i < 9; i++) {
      document.getElementById(i).innerHTML = gameBoard[i];
      if (gameBoard[i] === 'X') {
        document.getElementById(i).style = 'background-color: green';
      } else if (gameBoard[i] === 'O') {
        document.getElementById(i).style = 'background-color: blue';
      }
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

  drawGrid();
  generateGrid();
  gameRunning = true;

  function resetGame() {
    gameBoardDOM.innerHTML = '';
    gameRunning = true;
    drawGrid();
    generateGrid();
  }

  function checkWin() {
    if (boardFull(gameBoard)) {
      console.log('its a tie');
      allowAction = false;
      gameRunning = false;
          resetGame();
          return;
    }
    if (playerWins(gameBoard, 'X')) {
      console.log('you win wow');
          resetGame();
          return;
    }
    if (playerWins(gameBoard, 'O')) {
      console.log('ai wins');
          resetGame();
          return;
    }
    return false;
  }
  gameBoardDOM.addEventListener('click', function(event) {

    if (gameRunning) {
      if (gameBoard[event.target.id] === '') {
        gameBoard[event.target.id] = 'X';
        allowAction = false;
        renderBoard();
        checkWin();

        aiAlgo(gameBoard, 'O', 0);
        gameBoard[aiMove] = 'O';
        renderBoard();
        allowAction = true;
        checkWin();
      }
    }
  });

});
