import ChessController from './ChessController.mjs';
import { Horsyfier } from './Horsyfier.mjs';
export const initializeApp = function initializeApp() {

    const containerDiv = document.querySelector('#horsyChessApp');
    const chessController = new ChessController(containerDiv, new Horsyfier());
    chessController.initializeGame();
}