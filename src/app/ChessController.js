class ChessController {
    /**
     * Элемет-контейнер для всего веб-приложения. Задается единовременно при создании экземпляра класса
     * 
     * @type {HTMLDivElement}
     * @private
     */
    containerDiv;

    /**
     * Элемет для шахматной доски внутри контейнера приложения
     * 
     * @type {HTMLDivElement}
     * @private
     */
    boardDiv;

    /**
     * 
     * @param {HTMLDivElement} containerDiv Элемент-контейнер для всего веб-приложения
     */
    constructor(containerDiv) {
        this.containerDiv = containerDiv;
    }

    /**
     * Создает шахматную доску в контейнере веб-приложения
     * @returns {void}
     */
    initializeChessboard() {
        this.boardDiv = document.createElement('div');
        this.boardDiv.classList.add("board");

        this.containerDiv.insertAdjacentElement("afterbegin", this.boardDiv)

        /* Порождение верхней оси кординат */
        let colAxisHTML = '';
        for (let col = 0; col < 8; col++) {
            colAxisHTML = `<div class="col-axis">${LettersValuesMap.get(col + 1)}</div>`;
            this.boardDiv.insertAdjacentHTML("beforeend", colAxisHTML);
        }

        /* Порождение клеток */
        let squareId = '';
        let squareHTML = '';
        let squareClass = '';

        for (let col = 7; col >= 0; col--) {
            for (let row = 0; row < 8; row++) {
                squareId = `${LettersValuesMap.get(col + 1)}${row + 1}`;
                squareClass = (col + row) % 2 === 0 ? 'square-black' : 'square-white';

                /* Вставка клетки */
                squareHTML = `
                    <div id=${squareId}
                        class="${squareClass}"
                        data-column="${8 - col}"
                        data-row="${8 - row}"
                    ><div>`;
                this.boardDiv.insertAdjacentHTML("beforeend", squareHTML);
            }
        }

        /* Порождение нижней оси кординат */
        for (let col = 0; col < 8; col++) {
            colAxisHTML = `<div class="col-axis">${LettersValuesMap.get(col + 1)}</div>`;
            this.boardDiv.insertAdjacentHTML("beforeend", colAxisHTML);
        }

    }
}