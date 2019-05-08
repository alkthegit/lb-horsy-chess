const initializeApp = function initializeApp() {

    const containerDiv = document.querySelector('#horsyChessApp');
    const chessController = new ChessController(containerDiv, new Horsyfier());
    chessController.initializeGame();
}