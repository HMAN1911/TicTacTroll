document.addEventListener('DOMContentLoaded', function() {
  var gameBoardDOM = document.querySelector('#gameboard');
  var modal = document.getElementById('myModal');
  var modalContent = document.getElementById('modal-content');
  var modalMessage = document.getElementById('modal-message');
  var winsDOM = document.getElementById('wins');
  var lossesDOM = document.getElementById('losses');
  var drawsDOM = document.getElementById('draws');
  var playBtn = document.getElementById('play-button');
  var gameBoard = [];
  var aiMove = 0;
  var maxDepth = 6;
  var allowAction = true;
  var gameRunning = false;
  var wins = 0;
  var losses = 0;
  var draws = 0;
  var winningCombinations = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

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
        document.getElementById(i).style.backgroundColor = 'rgb(61, 61, 61)';
      } else if (gameBoard[i] === 'O') {
        document.getElementById(i).style.backgroundImage = 'url("troll.png")';
        document.getElementById(i).style.backgroundSize = 'cover';
      }
    }
  }

  function playerWins(boardState, token) {
    var win;
    for (var i = 0; i < winningCombinations.length; i++) {
      win = true;
      for (var j = 0; j < winningCombinations[i].length; j++) {
        if (boardState[winningCombinations[i][j]] !== token) {
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
    allowAction = true;
    drawGrid();
    generateGrid();
  }

  function checkWin() {
    if (boardFull(gameBoard)) {
      modalMessage.innerHTML = 'if you aint first, youre last.';
      draws += 1;
      drawsDOM.innerHTML = 'draws: ' + draws;
      modal.style.display = "block";
      allowAction = false;
      gameRunning = false;
      return true;
    }
    if (playerWins(gameBoard, 'X')) {
      modalMessage.innerHTML = 'wow grats you win nothing';
      wins += 1;
      winsDOM.innerHTML = 'player wins: ' + wins;
      modal.style.display = "block";
      allowAction = false;
      gameRunning = false;
      return true;
    }
    if (playerWins(gameBoard, 'O')) {
      modalMessage.innerHTML = 'problem?';
      losses += 1;
      lossesDOM.innerHTML = 'troll wins: ' + losses;
      modal.style.display = "block";
      allowAction = false;
      gameRunning = false;
      return true;
    }
    return false;
  }
  gameBoardDOM.addEventListener('click', function(event) {
    if (gameRunning && allowAction) {
      if (gameBoard[event.target.id] === '') {
        gameBoard[event.target.id] = 'X';
        allowAction = false;
        renderBoard();

        aiAlgo(gameBoard, 'O', 0);
        setTimeout(function() {
          gameBoard[aiMove] = 'O';
          renderBoard();
          allowAction = true;
          checkWin();
        }, 600);
      }
    }
  });
  playBtn.onclick = function(event) {
    if (modal.style.display === 'block') {
      maxDepth = Number(document.getElementById('difficulty').value);
      if (maxDepth === 0) {
        maxDepth = 1;
      }
      modal.style.display = "none";
      setTimeout(function() {
        resetGame();
      }, 500);
    }
  };
});
