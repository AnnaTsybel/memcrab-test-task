import { v4 as uuidv4 } from 'uuid';

import { Cell, PercentageCell } from "../../enteties/matrix";

const MATRIX_CELL_MIN_RANGE = 100;
const MATRIX_CELL_MAX_RANGE = 999;

/** Randomizes number from min to max value. */
const randomFromMinToMax = (minValue: number, maxValue: number): number => {
    return Math.round(minValue + Math.random() * (maxValue - minValue));
};

/** Finds median from array. */
const findMedian = (arr: number[]): number => {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);

    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

/** Calculates percentage. */
const calculatePercentage = (partialValue: number, totalValue: number): number => {
    return Math.round((partialValue * 100) / totalValue);
};

/** Generates matrix from amount of row and amount of columns. */
export const calculateMatrix = (rowsAmount: number, columnsAmount: number): Cell[][] => {
    const matrix: Cell[][] = [];

    for (let i = 0; i < rowsAmount; ++i) {
        const row: Cell[] = [];

        for (let j = 0; j < columnsAmount; ++j) {
            const id = uuidv4();
            const amount = randomFromMinToMax(MATRIX_CELL_MIN_RANGE, MATRIX_CELL_MAX_RANGE);

            row.push({ id, amount });
        }

        matrix.push(row);
    }

    return matrix;
};

/** Calculates median of column. */
export const calculateMedianOfCol = (matrix: Cell[][], rowsAmount: number, columnsAmount: number): number[] => {
    const columnsMedians: number[] = [];

    for (let i = 0; i < columnsAmount; ++i) {
        const columnAmount: number[] = [];

        for (let j = 0; j < rowsAmount; ++j) {
            const currentItem = matrix[j][i];
            columnAmount.push(currentItem.amount);
        }

        const medianOfColumn = findMedian(columnAmount);

        columnsMedians.push(medianOfColumn);
    }

    return columnsMedians;
};

/** Increases cell amount. */
export const increaseCellCount = (matrix: Cell[][], id: string) => {
    return matrix.map(row =>
        row.map(cell => {
            if (cell.id === id && cell.amount < MATRIX_CELL_MAX_RANGE) {
                return { ...cell, amount: cell.amount + 1 };
            }
            return cell;
        })
    );
}

/** Calculates sum of values in row. */
export const calculateSumOfRows = (matrix: Cell[][]): number[] => {
    const sum: number[] = [];

    matrix.map((row) => {
        const initialValue = 0;

        const sumWithInitial = row.reduce(
            (accumulator, currentValue) => accumulator + currentValue.amount,
            initialValue,
        );

        sum.push(sumWithInitial);

        return;
    })

    return sum;
};

/** Adds row. */
export const addMatrixRow = (matrix: Cell[][], columnsAmount: number): Cell[][] => {
    const row: Cell[] = [];

    for (let i = 0; i < columnsAmount; i++) {
        const id = uuidv4();
        const amount = randomFromMinToMax(MATRIX_CELL_MIN_RANGE, MATRIX_CELL_MAX_RANGE);

        row.push({ id, amount });
    }

    matrix.push(row);

    return matrix;
};

/** Deletes row. */
export const deleteRow = (matrix: Cell[][], index: number): Cell[][] => matrix.filter((_, i) => i !== index);

/** Calculates how many percents every cell are from sum of row. */
export const calculateRowPercentages = (matrix: Cell[][], index: number): PercentageCell[] => {
    const percentages: PercentageCell[] = [];

    const rowMatrix = matrix[index];
    const calculatedSumOfRows = calculateSumOfRows(matrix);

    const filteredRow = Array.from(rowMatrix, (rowMatrixItem => rowMatrixItem.amount));
    const maxAmount = Math.max(...filteredRow);

    for (let i = 0; i < rowMatrix.length; i++) {
        const currentRow = rowMatrix[i];

        const percentage = calculatePercentage(currentRow.amount, calculatedSumOfRows[index]);
        const percentageFromMaxAmount = calculatePercentage(currentRow.amount, maxAmount);

        percentages.push({
            id: currentRow.id,
            amount: currentRow.amount,
            percentageFromMaxAmount,
            percentage,
        })
    }

    return percentages;
};

/** Detects cells, which are nearest to hovered cell amount. */
export const detectNearestCellsId = (matrix: Cell[][], cell: Cell, nearestLimit: number): string[] => {
    const sortedMatrixCells = matrix.flat().sort((cellCurr, cellPrev) => cellCurr.amount - cellPrev.amount);

    const cellIndex = sortedMatrixCells.findIndex((item) => item.id === cell.id);
    const minIndex = (cellIndex - nearestLimit) >= 0 ? cellIndex - nearestLimit : 0;
    const maxIndex = (cellIndex + nearestLimit) <= sortedMatrixCells.length ? cellIndex + nearestLimit + 1 : sortedMatrixCells.length;

    const rangedCells = sortedMatrixCells.slice(minIndex, maxIndex);

    if (rangedCells.length === nearestLimit + 1) {
        const filteredWithoutHoveredCell = rangedCells.filter((rangedCell) => rangedCell.id !== cell.id);

        return filteredWithoutHoveredCell.map(item => item.id);
    }

    rangedCells.sort((curr: Cell, prev: Cell) => {
        return Math.abs(cell.amount - curr.amount) - Math.abs(cell.amount - prev.amount);
    });

    const nearestCells = rangedCells.splice(0, nearestLimit + 1);

    const filteredWithoutHoveredCell = nearestCells.filter((nearestCell) => nearestCell.id !== cell.id);
    const nearestCellsId = filteredWithoutHoveredCell.map(item => item.id);

    return nearestCellsId;
};
