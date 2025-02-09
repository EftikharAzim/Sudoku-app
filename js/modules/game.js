// Game logic module
export class SudokuGame {
  constructor() {
    this.N = 9;
    this.score = 100;
    this.solution = null;
    this.board = null;
  }

  initializeBoard() {
    this.board = Array(this.N)
      .fill()
      .map(() => Array(this.N).fill(0));

    // Fill diagonal 3x3 boxes with random numbers
    for (let box = 0; box < 3; box++) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const randomIndex = Math.floor(Math.random() * numbers.length);
          this.board[i + box * 3][j + box * 3] = numbers[randomIndex];
          numbers.splice(randomIndex, 1);
        }
      }
    }

    this.solve(this.board);
    this.solution = this.board.map((row) => [...row]);
    return this.board;
  }

  isSafe(board, row, col, num) {
    // Check the row
    for (let i = 0; i < this.N; i++) {
      if (board[row][i] === num) return false;
    }

    // Check the column
    for (let i = 0; i < this.N; i++) {
      if (board[i][col] === num) return false;
    }

    // Check the 3x3 subgrid
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  }

  solve(board) {
    for (let row = 0; row < this.N; row++) {
      for (let col = 0; col < this.N; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= this.N; num++) {
            if (this.isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (this.solve(board)) return true;
              board[row][col] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  validateMove(row, col, value) {
    if (value === this.solution[row][col]) {
      return { isValid: true, newScore: this.score };
    } else {
      this.score = Math.max(0, this.score - 5);
      return { isValid: false, newScore: this.score };
    }
  }

  getHint(currentBoard) {
    if (this.score === 0) return { error: "No more hints available - score is 0!" };

    // Check if current board state is valid
    for (let row = 0; row < this.N; row++) {
      for (let col = 0; col < this.N; col++) {
        const value = currentBoard[row][col];
        if (value !== 0) {
          currentBoard[row][col] = 0;
          if (!this.isSafe(currentBoard, row, col, value)) {
            return { error: "Current board state is invalid!" };
          }
          currentBoard[row][col] = value;
        }
      }
    }

    // Find first empty cell and return its solution
    for (let row = 0; row < this.N; row++) {
      for (let col = 0; col < this.N; col++) {
        if (currentBoard[row][col] === 0) {
          this.score = Math.max(0, this.score - 10);
          return {
            hint: {
              row,
              col,
              value: this.solution[row][col]
            },
            newScore: this.score
          };
        }
      }
    }
  }

  checkCompletion(currentBoard) {
    return currentBoard.every((row, i) =>
      row.every((value, j) => value !== 0 && value === this.solution[i][j])
    );
  }
}