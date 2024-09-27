"use strict";

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    if (board[row][column].getValue() === 0) {
      board[row][column].addToken(player);
      return true;
    }
    return false;
  };

  return { getBoard, dropToken };
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

  return { playRound };
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
