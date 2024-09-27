"use strict";

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = Cell();
    }
  }

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true; // Successfully dropped the token
    }
    return false; // Cell already occupied
  };

  const checkWin = (playerToken) => {
    const valueToCheck = playerToken === "X" ? 1 : 2;

    // Check rows and columns for a win
    for (let i = 0; i < rows; i++) {
      // Check rows
      if (
        board[i][0].getValue() === valueToCheck &&
        board[i][1].getValue() === valueToCheck &&
        board[i][2].getValue() === valueToCheck
      ) {
        return true; // Row win
      }
      // Check columns
      if (
        board[0][i].getValue() === valueToCheck &&
        board[1][i].getValue() === valueToCheck &&
        board[2][i].getValue() === valueToCheck
      ) {
        return true; // Column win
      }
    }

    // Check diagonals for a win
    if (
      board[0][0].getValue() === valueToCheck &&
      board[1][1].getValue() === valueToCheck &&
      board[2][2].getValue() === valueToCheck
    ) {
      return true; // Diagonal win
    }
    if (
      board[0][2].getValue() === valueToCheck &&
      board[1][1].getValue() === valueToCheck &&
      board[2][0].getValue() === valueToCheck
    ) {
      return true; // Diagonal win
    }

    return false; // No win found
  };

  const isDraw = () => {
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j] = Cell();
      }
    }
  };

  return { dropToken, checkWin, isDraw, resetBoard };
}

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player === "X" ? 1 : 2;
  };
  const getValue = () => value;
  return { addToken, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    if (board.dropToken(row, column, getActivePlayer().token)) {
      updateUI(row, column, getActivePlayer().token);

      // Check for win or draw
      if (board.checkWin(getActivePlayer().token)) {
        displayStatus(`${getActivePlayer().name} wins!`);
        return;
      }

      if (board.isDraw()) {
        displayStatus("It's a draw!");
        return;
      }

      switchPlayerTurn();
      updateTurnMessage();
    }
  };

  const updateUI = (row, column, token) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${column}"]`
    );
    cell.textContent = token;
  };

  const updateTurnMessage = () => {
    const playerTurn = document.getElementById("player-turn");
    playerTurn.textContent = `${getActivePlayer().name}'s turn (${
      getActivePlayer().token
    })`;
  };

  const displayStatus = (message) => {
    const status = document.getElementById("game-status");
    status.textContent = message;

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.pointerEvents = "none";
    });

    // Show the reset button
    const resetButton = document.getElementById("reset-button");
    resetButton.style.display = "block";
  };

  const resetGame = () => {
    board.resetBoard();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.style.pointerEvents = "auto";
    });
    updateTurnMessage();
    const status = document.getElementById("game-status");
    status.textContent = "";
    const resetButton = document.getElementById("reset-button");
    resetButton.style.display = "none";
  };

  return { playRound, resetGame };
}

const game = GameController();

const boardElement = document.getElementById("game-board");

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-row", row);
    cell.setAttribute("data-col", col);
    cell.addEventListener("click", () => game.playRound(row, col));
    boardElement.appendChild(cell);
  }
}
