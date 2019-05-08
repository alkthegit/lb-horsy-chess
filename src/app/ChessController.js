const appState = {
    selectedSquare: {
        id: '',
        column: -1,
        row: -1
    },
    selectedId: -1,
    selectedSquareElement: undefined
}

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
     * Элемет для расположения группы клеток на шахматной доске
     * 
     * @type {HTMLDivElement}
     * @private
     */
    squaresDiv;

    /**
     * 
     * @param {HTMLDivElement} containerDiv Элемент-контейнер для всего веб-приложения
     */
    constructor(containerDiv) {
        this.containerDiv = containerDiv;
    }

    initializeGame() {
        this.initializeBoard();
        this.setEventListeners();
    }

    /**
     * Создает шахматную доску в контейнере веб-приложения
     * @returns {void}
     */
    initializeBoard() {
        this.boardDiv = document.createElement('div');
        this.boardDiv.classList.add("board");

        this.containerDiv.insertAdjacentElement("afterbegin", this.boardDiv);

        this.squaresDiv = document.createElement('div');
        this.squaresDiv.classList.add("squares");
        this.boardDiv.insertAdjacentElement("afterbegin", this.squaresDiv);

        /* Порождение верхней оси кординат */
        let axisRow = document.createElement('div');
        let colAxisHTML = '';
        for (let col = 0; col < 8; col++) {
            colAxisHTML = `<div class="col-axis">${col + 1}</div>`;
            axisRow.insertAdjacentHTML("beforeend", colAxisHTML);
        }
        this.boardDiv.insertAdjacentElement("afterbegin", axisRow);

        /* Порождение клеток */
        let squareId = '';
        let squareHTML = '';
        let squareClass = '';

        for (let row = 7; row >= 0; row--) {
            for (let col = 0; col < 8; col++) {
                squareId = `${LettersValuesMap.get(col + 1)}${row + 1}`;
                squareClass = (col + row) % 2 === 0 ? 'square-black' : 'square-white';

                /* Вставка клетки */
                squareHTML = `
                    <div id=${squareId}
                        class="${squareClass}"
                        data-column="${col}"
                        data-row="${row}"
                    ><div>`;
                this.squaresDiv.insertAdjacentHTML("beforeend", squareHTML);
            }
        }

        /* Порождение нижней оси кординат */
        /* for (let col = 0; col < 8; col++) {
            colAxisHTML = `<div class="col-axis">${LettersValuesMap.get(col + 1)}</div>`;
            this.boardDiv.insertAdjacentHTML("beforeend", colAxisHTML);
        } */
    }

    setEventListeners() {
        this.squaresDiv.addEventListener("click", this.onSquaresClick);
    }

    onSquaresClick = (event) => {
        const selectedSquare = event.target;
        if (!(selectedSquare.classList.contains('square-black') || selectedSquare.classList.contains('square-white'))) {
            /* Если рользователь нажал не на клетку, то ничего не делаем */
            return;
        }
        const selectedId = selectedSquare.id;

        if (appState.selectedId !== selectedId) {
            /* Если выбрана еще не выбранная клетка, выбирае ее и меняем состояние приложения соответственно */
            if (appState.selectedId !== -1) {
                this.toggleSelectedSquare();
            }

            appState.selectedSquareElement = selectedSquare;
            appState.selectedId = selectedId;

            this.toggleSelectedSquare();
        }
        else {
            /* Если нажата уже выбранная клетка, то отменяем выделение и сбрасываем состояние */
            this.toggleSelectedSquare();

            appState.selectedId = -1;
            appState.selectedSquareElement = undefined;

        }
        console.log(appState.selectedSquareElement);
    }

    toggleSelectedSquare() {
        if (appState.selectedSquareElement.classList.contains('square-white')) {
            appState.selectedSquareElement.classList.toggle('square-selected-white');
        }
        else if (appState.selectedSquareElement.classList.contains('square-black')) {
            appState.selectedSquareElement.classList.toggle('square-selected-black');
        }
    }

}