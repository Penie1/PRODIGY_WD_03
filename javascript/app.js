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
