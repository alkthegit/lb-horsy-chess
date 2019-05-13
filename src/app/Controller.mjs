import { LettersValuesMap } from './Horsyfier.mjs';
/**
 * Состояние приложения
 * @type {{selectedId: number, selectedSquareElement: HTMLDivElement, moves: string[]}}
 */
const appState = {
  selectedId: -1,
  selectedSquareElement: undefined,
  moves: [],
};

/**
 * Выделяет или снимает выделение у выбранной клетки
 *
 * @returns {void}
 * @private
 */
const toggleSelectedSquare = function toggleSelectedSquare() {
  if (appState.selectedSquareElement.classList.contains('square-white')) {
    appState.selectedSquareElement.classList.toggle('square-selected-white');
  } else if (appState.selectedSquareElement.classList.contains('square-black')) {
    appState.selectedSquareElement.classList.toggle('square-selected-black');
  }
};

/**
 * Сбрасывает текущее состояние приложения к исходному состоянию
 *
 * @private
 */
const resetAppState = function resetAppState() {
  appState.selectedId = -1;
  appState.selectedSquareElement = undefined;
  appState.moves = [];
};

export default class ChessController {
  /**
   *
   * @param {HTMLDivElement} containerDiv Элемент-контейнер для всего веб-приложения
   * @param {Horsyfier} horsyfier Экземпляр управляющего класса Horsyfier
   */
  constructor(containerDiv, horsyfier) {
    if (!containerDiv) {
      throw new Error(
        `Для контроллера необходимо указать контейнер приложения. Педано значение '${containerDiv}'`,
      );
    }
    if (!horsyfier) {
      throw new Error(
        `Для контроллера необходимо указать экземпляр класса Horsyfier. Передано значение '${horsyfier}'`,
      );
    }

    /**
     * Элемет-контейнер для всего веб-приложения. Задается единовременно при создании
     * экземпляра класса
     *
     * @type {HTMLDivElement}
     * @private
     */
    this.containerDiv = containerDiv;

    /**
     * Элемет для шахматной доски внутри контейнера приложения
     *
     * @type {HTMLDivElement}
     * @private
     */
    this.boardDiv = undefined;

    /**
     * Элемет для расположения группы клеток на шахматной доске
     *
     * @type {HTMLDivElement}
     * @private
     */
    this.squaresDiv = undefined;

    /**
     * Экземпляр класса Horsyfier
     *
     * @type {Horsyfier}
     * @private
     */
    this.horsyfier = horsyfier;

    // привязка обработчиков событий
    this.onSquaresClick = this.onSquaresClick.bind(this);
  }

  /**
   * Начинает игру
   *
   * @returns {void}
   * @public
   */
  initializeGame() {
    this.initializeBoard();
    this.setEventListeners();
  }

  /**
   * Создает шахматную доску в контейнере веб-приложения
   *
   * @returns {void}
   * @private
   */
  initializeBoard() {
    // создаем каркас доски
    const boardHTML = `
            <div class="board">
                <div class="area-topleft"></div>
                <div class="axis-top"></div>
                <div class="area-topright"></div>

                <div class="axis-left"></div>
                <div class="squares"></div>
                <div class="axis-right"></div>
                
                <div class="area-bottomleft"></div>
                <div class="axis-bottom"></div>
                <div class="area-bottomright"></div>
            </div>
        `;

    this.containerDiv.insertAdjacentHTML('afterbegin', boardHTML);

    // сохраняем ссылки на элементы доски
    this.boardDiv = this.containerDiv.querySelector('.board');
    this.squaresDiv = this.boardDiv.querySelector('.squares');

    /* Порождение клеток */
    let squareId = '';
    let squareHTML = '';
    let squareClass = '';
    for (let row = 7; row >= 0; row -= 1) {
      for (let col = 0; col < 8; col += 1) {
        squareId = `${LettersValuesMap.get(col + 1)}${row + 1}`;
        squareClass = (col + row) % 2 === 0 ? 'square-black' : 'square-white';

        /* Вставка клетки */
        squareHTML = `
                    <div id=${squareId}
                        class="${squareClass}"
                        data-column="${col}"
                        data-row="${row}"
                    ><div>`;
        this.squaresDiv.insertAdjacentHTML('beforeend', squareHTML);
      }
    }

    /* Порождение осей */
    this.populateAxis();
  }

  /**
   * Назначает обработчики событий пользовательским элементам управления
   *
   * @returns {void}
   * @private
   */
  setEventListeners() {
    this.squaresDiv.addEventListener('click', this.onSquaresClick);
  }

  /**
   * Обработчик события - нажатие мышью на область с клетками
   *
   * @returns {void}
   * @private
   */
  onSquaresClick(event) {
    /**
     * @type {HTMLDivElement}
     */
    const selectedSquare = event.target;
    if (
      !(
        selectedSquare.classList.contains('square-black')
        || selectedSquare.classList.contains('square-white')
      )
    ) {
      /* Если рользователь нажал не на клетку, то ничего не делаем */
      return;
    }
    const selectedId = selectedSquare.id;

    // получаем возможные ходы
    this.horsyfier.setPosition(selectedId);

    /* Выделяем нажатую клетку */
    if (appState.selectedId !== selectedId) {
      /* переключаем внешний вид клеток только если какая-то клетка уже была выбрана
      (то есть это не первый за игру выбор клетки) */
      if (appState.selectedId !== -1) {
        // переключаем внешний вид выбранной клетки и клеток с ходами
        toggleSelectedSquare();
        this.toggleHighlightedSquares();
        appState.selectedSquareElement.textContent = '';
      }

      // устанавливаем текущее состояние приложения
      appState.selectedSquareElement = selectedSquare;
      appState.selectedId = selectedId;
      appState.moves = this.horsyfier.getHorseMoves();

      // переключаем внешний вид выбранной клетки и клеток с ходами
      toggleSelectedSquare();
      this.toggleHighlightedSquares();
      selectedSquare.textContent = selectedSquare.id;
    } else {
      /* Если нажата уже выбранная клетка, то:
        выключаем выделени выбранной клетки
        выключаем подсветку клеток с ходами
        сбрасываем состояние к исходному
        */
      toggleSelectedSquare();
      this.toggleHighlightedSquares();
      appState.selectedSquareElement.textContent = '';

      resetAppState();
    }
  }

  toggleHighlightedSquares() {
    // подсвчиваем клетки
    /**
     * @type {HTMLDivElement}
     */
    let squareElement;
    appState.moves.forEach((e) => {
      squareElement = this.squaresDiv.querySelector(`#${e}`);
      if (squareElement.classList.contains('square-white')) {
        squareElement.classList.toggle('square-highlighted-white');
      } else if (squareElement.classList.contains('square-black')) {
        squareElement.classList.toggle('square-highlighted-black');
      }

      // если элемент подсвечен, то показываем название клетки, иначе убираем название
      if (
        squareElement.classList.contains('square-highlighted-black')
        || squareElement.classList.contains('square-highlighted-white')
      ) {
        squareElement.textContent = squareElement.id;
      } else {
        squareElement.textContent = '';
      }
    });
  }

  /**
   * Заполняет оси соответствующей разметкой
   *
   * @private
   */
  populateAxis() {
    let axisHTML;
    let axisElement;

    // разметка для верхней и для нижней оси
    axisHTML = `
            <div class="axis-label-hr">A</div>
            <div class="axis-label-hr">B</div>
            <div class="axis-label-hr">C</div>
            <div class="axis-label-hr">D</div>
            <div class="axis-label-hr">E</div>
            <div class="axis-label-hr">F</div>
            <div class="axis-label-hr">G</div>
            <div class="axis-label-hr">H</div>
        `;

    // верхняя ось
    axisElement = this.boardDiv.querySelector('.axis-top');
    if (axisElement) {
      axisElement.insertAdjacentHTML('afterbegin', axisHTML);
    }
    // нижняя ось
    axisElement = this.boardDiv.querySelector('.axis-bottom');
    if (axisElement) {
      axisElement.insertAdjacentHTML('afterbegin', axisHTML);
    }

    // разметка для левой и правой оси
    axisHTML = `
            <div class="axis-label-vr">8</div>
            <div class="axis-label-vr">7</div>
            <div class="axis-label-vr">6</div>
            <div class="axis-label-vr">5</div>
            <div class="axis-label-vr">4</div>
            <div class="axis-label-vr">3</div>
            <div class="axis-label-vr">2</div>
            <div class="axis-label-vr">1</div>
        `;

    // верхняя ось
    axisElement = this.boardDiv.querySelector('.axis-left');
    if (axisElement) {
      axisElement.insertAdjacentHTML('afterbegin', axisHTML);
    }
    // нижняя ось
    axisElement = this.boardDiv.querySelector('.axis-right');
    if (axisElement) {
      axisElement.insertAdjacentHTML('afterbegin', axisHTML);
    }
  }
}
