const positionFormatRegexp = /^[a-hA-H]{1}[1-9]{1}$/i;

/**
 * @const {Map}
 */
const LettersValuesMap = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4],
    ['e', 5],
    ['f', 6],
    ['g', 7],
    ['h', 8],
    ['A', 1],
    ['B', 2],
    ['C', 3],
    ['D', 4],
    ['E', 5],
    ['F', 6],
    ['G', 7],
    ['H', 8],
    [1, 'A'],
    [2, 'B'],
    [3, 'C'],
    [4, 'D'],
    [5, 'E'],
    [6, 'F'],
    [7, 'G'],
    [8, 'H'],
]);

/**
 * @const {{column: number, row: number}[]}
 */
const horseTries = [
    {
        column: -2, row: -1
    },
    {
        column: -2, row: 1
    },
    {
        column: -1, row: -2
    },
    {
        column: -1, row: 2
    },
    {
        column: 1, row: -2
    },
    {
        column: 1, row: 2
    },
    {
        column: 2, row: -1
    },
    {
        column: 2, row: 1
    }
];

class Horsyfier {
    /*
        Числовой двухмерный индекс, соответствующий текущему положению фигуры
        диапазо каждого измерения - [0; 7].
        Значеие по умолчанию - {0, 0}, что соответствует клетке A1         
    */
    currentIndex = {
        column: 0,
        row: 0
    }

    /* Представление клетки шахматной доски в формате A1 в виде объекта*/
    currentPosition = 'A1';

    /**
     * Устанавливает текущую позицию шахматной фигуры на доске, в формате A1 или a1, и т.д.
     * 
     * @param {string} position - Новая клетка шахматной фигуры 
     * @returns {void}
     * @public
     */
    setPosition(position) {
        if (!this.checkPositionFormat(position)) {
            throw new Error(`Клетка шахматной доски должна быть указана в формате A1 или a1. Передано значение: '${position}'`);
        }

        this.currentIndex = this.translatePositionToIndex(position);
        this.currentPosition = position.toUpperCase();
    }

    /**
     * @returns {string[]} Массив допустимых ходов в формате A1 и т.п., отсортированный по алфавиту
     */
    getHorseMoves() {
        /* Для поиска возможных ходов конем перебираем допустимые движения из массива horseTries
        и оставляем те, которые сохраняют индекс колонки и строки в допустимых диапазонах:
            1. Отфильтровать допустимые ходы
            2. Перевести найденные ходы в привычный формат A1 и т.д.
        */
        const moves = horseTries
            .map(e => this.tryMove(e))
            .filter(e => this.checkPositionIndex(e))
            .map(e => this.translateIndexToPosition(e));

        return moves.sort();
    }

    /**
     * Возвращает гипотетическое положение фигуры после попытки переместить ее на указаное расстояние от текущего положения this.currentIndex
     * 
     * @param {{column: number, row: number}} moveIndex двухмерный целочисленный индекс, обозначающий сдвиг фгуры на шахматной доске
     * @retuns {{column: number, row: number}} двухмерный целочисленный индекс, соответствующий новому возможному положению фигуры на шахматной доске без проверки выхода за границы доски
     * @private
     */
    tryMove(moveIndex) {
        if (typeof moveIndex === 'undefined') {
            throw new Error(`Необходимо указать индекс`);
        }

        const newPosition = {
            column: this.currentIndex.column + moveIndex.column,
            row: this.currentIndex.row + moveIndex.row
        };
        return newPosition;
    }

    /**
     * Проверяет, что указаная строка является правильным названием клетки на шахматной доске
     * @param {string} position - Новая клетка шахматной фигуры
     * @returns {boolean} true - если аргумент position соответствует формату записи клетки шахматной доски,  false - в противном случае
     * @private
     */
    checkPositionFormat(position) {
        return positionFormatRegexp.test(position);
    }

    /**
     * Проверяет, что указаный двухмерный индекс является допустимым, то есть значения измерений лежат в допустимых диапазонах {[0; 7], [0; 7]}
     * @param {{column: number, row: number}} index - Новая клетка шахматной фигуры
     * @returns {boolean} true - если индекс допустимый и false - в противном случае
     * @private
     */
    checkPositionIndex(index) {
        if (typeof index === 'undefined') {
            throw new Error(`Необходимо указать индекс`);
        }

        return (index.column >= 0 && index.column <= 7) && (index.row >= 0 && index.row <= 7);
    }

    /**
     * Переводит привычное название клетки шахматной доски в формате A1 в двумерный индекс {column, row}
     * 
     * @param {string} position
     * @returns {{column: number, row: number}} - двухмерный индекс, соответствующий клетке position. Размерность индекса: {[0;7 ],[0; 7]}
     * @private
     */
    translatePositionToIndex(position) {
        if (!this.checkPositionFormat(position)) {
            throw new Error(`Клетка шахматной доски должна быть указана в формате A1 или a1. Передано значение: '${position}'`);
        }

        let index = {
            column: 0,
            row: 0
        };

        const [letter, digit] = position.split('');

        index.row = digit - 1;
        index.column = LettersValuesMap.get(letter) - 1;
        return index;
    }

    /**
     * Переводит внутреннее представление для положения фигуры на шахматной доске в привычный формат A1 и т.п.
     * 
     * @param {{column: number, row: number}} index - двухмерный индекс, соответствующий клетке position. Размерность индекса: {[0;7 ],[0; 7]}
     * @returns {string} привычное название клетки шахматной доски в формате A1 и т.п.
     * @private
     */
    translateIndexToPosition(index) {
        if (typeof index === 'undefined') {
            throw new Error(`Необходимо указать индекс`);
        }

        const position = {
            column: LettersValuesMap.get(index.column + 1),
            row: index.row + 1
        }

        const result = `${position.column}${position.row}`;

        return result.toUpperCase();
    }
}