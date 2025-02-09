// UI module
export class SudokuUI {
  constructor(game) {
    this.game = game;
    this.grid = document.getElementById("sudoku-grid");
    this.hintButton = document.getElementById("hint-btn");
    this.scoreDisplay = this.createScoreDisplay();
    this.setupEventListeners();
  }

  createScoreDisplay() {
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "score-display";
    scoreDisplay.style.marginTop = "20px";
    scoreDisplay.style.fontSize = "18px";
    document
      .querySelector(".sudoku-container")
      .insertBefore(scoreDisplay, this.hintButton);
    return scoreDisplay;
  }

  updateScoreDisplay(score) {
    this.scoreDisplay.textContent = `Score: ${score}`;
  }

  createGrid(board) {
    this.grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.maxLength = 1;
        input.min = 1;
        input.max = 9;

        input.addEventListener("input", (e) => this.handleInput(e, i, j));
        input.addEventListener("keypress", this.handleKeyPress);
        input.addEventListener("paste", (e) => e.preventDefault());

        if (Math.random() < 0.3) {
          input.value = board[i][j];
          input.disabled = true;
        }

        cell.appendChild(input);
        row.appendChild(cell);
      }
      this.grid.appendChild(row);
    }
  }

  handleInput(event, row, col) {
    const input = event.target;
    const value = parseInt(input.value);

    if (value) {
      const result = this.game.validateMove(row, col, value);
      input.style.color = result.isValid ? "black" : "red";
      this.updateScoreDisplay(result.newScore);

      if (!result.isValid) {
        this.showMessage("Wrong number! -5 points", "error");
        if (result.newScore === 0) {
          this.disableAllInputs();
          this.showGameOver();
        }
      } else if (this.game.checkCompletion(this.getCurrentBoard())) {
        this.showCongratulations();
      }
    }
  }

  handleKeyPress(event) {
    if (!/[1-9]/.test(event.key) || event.target.value.length > 0) {
      event.preventDefault();
    }
  }

  getCurrentBoard() {
    const board = [];
    const inputs = this.grid.querySelectorAll("input");
    let counter = 0;

    for (let i = 0; i < 9; i++) {
      const row = [];
      for (let j = 0; j < 9; j++) {
        const value = parseInt(inputs[counter].value) || 0;
        row.push(value);
        counter++;
      }
      board.push(row);
    }
    return board;
  }

  disableAllInputs() {
    const inputs = this.grid.querySelectorAll("input:not([disabled])");
    inputs.forEach(input => input.disabled = true);
  }

  showModal(title, content) {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      text-align: center;
      z-index: 1000;
    `;
    modal.innerHTML = content;
    document.body.appendChild(modal);
  }

  showGameOver() {
    this.showModal("Game Over", `
      <h2>Game Over!</h2>
      <p>Your score has reached 0. You cannot continue playing.</p>
      <button onclick="location.reload()">Try Again</button>
    `);
  }

  showCongratulations() {
    this.showModal("Congratulations", `
      <h2>Congratulations!</h2>
      <p>You've completed the Sudoku puzzle!</p>
      <p>Final Score: ${this.game.score}</p>
      <button onclick="location.reload()">Play Again</button>
    `);
  }

  showMessage(text, type) {
    const message = document.createElement("div");
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      border-radius: 5px;
      color: white;
      background-color: ${type === "error" ? "#ff4444" : "#44aa44"};
      z-index: 1000;
    `;
    message.textContent = text;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
  }

  setupEventListeners() {
    this.hintButton.addEventListener("click", () => {
      const result = this.game.getHint(this.getCurrentBoard());
      if (result.error) {
        this.showMessage(result.error, "error");
      } else {
        const cell = this.grid.querySelector(
          `tr:nth-child(${result.hint.row + 1}) td:nth-child(${result.hint.col + 1}) input`
        );
        cell.value = result.hint.value;
        cell.style.color = "blue";
        this.updateScoreDisplay(result.newScore);
        this.showMessage("Hint provided! -10 points", "error");
      }
    });
  }
}