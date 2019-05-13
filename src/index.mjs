import initializeApp from './app/app.mjs';

const initialize = function initialize() {
  console.log('Application has started');

  initializeApp(document);
};

document.addEventListener('DOMContentLoaded', initialize);
