import Controller from './Controller.mjs';
import { Horsyfier } from './Horsyfier.mjs';

const initializeApp = function initializeApp(document) {
  const containerDiv = document.querySelector('#horsyChessApp');
  const controller = new Controller(containerDiv, new Horsyfier());
  controller.initializeGame();
};

export default initializeApp;
