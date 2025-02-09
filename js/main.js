import { SudokuGame } from './modules/game.js';
import { SudokuUI } from './modules/ui.js';

// Initialize the game
const game = new SudokuGame();
const board = game.initializeBoard();

// Initialize the UI
const ui = new SudokuUI(game);
ui.createGrid(board);
ui.updateScoreDisplay(game.score);