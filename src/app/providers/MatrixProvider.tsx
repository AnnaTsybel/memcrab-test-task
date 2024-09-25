import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

import { Cell, PercentageCell } from "../../enteties/matrix";
import {
    calculateMedianOfCol,
    calculateSumOfRows,
    calculateMatrix,
    deleteRow,
    calculateRowPercentages,
    detectNearestCellsId,
    addMatrixRow,
    increaseCellCount
} from "../utils/matrix";
import { LocalStorageKeys, setLocalStorageItem } from "../utils/storage";

export interface StateInterface {
    rowsAmount: number;
    columnsAmount: number;
    nearestLimit: number;
    matrix: Cell[][];
    sumOfRows: number[];
    columnsMedian: number[];
    calculatedRowPercentages: PercentageCell[];
    hoveredSumRowIndex: number | null;
    nearestCellsId: string[];
    hoveredCellId: string | null;
    maxAmountOfHoveredRow: number;
}

interface ContextState {
    matrixState: StateInterface;
    setMatrixState: Dispatch<SetStateAction<StateInterface>>;
    generateMatrix: (rowsAmount: number, columnsAmount: number, nearestLimit: number) => void;
    generateColumnsMedian: () => number[];
    generateSumOfRows: () => number[];
    incrementCellAmount: (id:string) => void;
    addRow: () => void;
    deleteMatrixRow: (index: number) => void;
    calculateRowValuesPercentage: (index: number | null) => void;
    findNearestCellId: (cell: Cell | null) => void;
}

export const MatrixState = createContext<ContextState>({} as ContextState);

const initialState: StateInterface = {
    rowsAmount: 0,
    columnsAmount: 0,
    nearestLimit: 0,
    matrix: [],
    sumOfRows: [],
    columnsMedian: [],
    calculatedRowPercentages: [],
    hoveredSumRowIndex: null,
    nearestCellsId: [],
    hoveredCellId: null,
    maxAmountOfHoveredRow: 0,
};

export const MatrixProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [matrixState, setMatrixState] = useState(initialState);

    const generateMatrix = (rowsAmount: number, columnsAmount: number, nearestLimit: number): void => {
        const matrix: Cell[][] = calculateMatrix(rowsAmount, columnsAmount);

        setMatrixState({
            ...matrixState,
            matrix,
            rowsAmount,
            columnsAmount,
            nearestLimit
        });
    };

    const generateColumnsMedian = (): number[] => {
        const columnsMedian = calculateMedianOfCol(matrixState.matrix, matrixState.rowsAmount, matrixState.columnsAmount);

        return columnsMedian;
    };

    const generateSumOfRows = (): number[] => {
        const sumOfRows = calculateSumOfRows(matrixState.matrix);

        return sumOfRows;
    };

    const incrementCellAmount = (id: string): void => {
        const matrix = increaseCellCount(matrixState.matrix, id);
        
        setMatrixState({ ...matrixState, matrix });
    };

    const addRow = () => {
        const incrementedRows = matrixState.rowsAmount + 1;

        setLocalStorageItem(LocalStorageKeys.ROWS_AMOUNT, JSON.stringify(incrementedRows));
        
        const matrix: Cell[][] = addMatrixRow(matrixState.matrix, matrixState.columnsAmount);

        setMatrixState({
            ...matrixState,
            matrix: matrix,
            rowsAmount: incrementedRows
        });
    }

    const deleteMatrixRow = (index: number) => {
        const decrementedRows = matrixState.rowsAmount - 1;

        setLocalStorageItem(LocalStorageKeys.ROWS_AMOUNT, JSON.stringify(decrementedRows));

        const matrix: Cell[][] = deleteRow(matrixState.matrix, index);

        setMatrixState({
            ...matrixState,
            matrix: matrix,
            rowsAmount: decrementedRows,
        });
    }

    const calculateRowValuesPercentage = (index: number | null) => {
        if (typeof index === 'object') {
            setMatrixState({
                ...matrixState,
                calculatedRowPercentages: [],
                hoveredSumRowIndex: null,
            });

            return;
        }

        const calculatedRowPercentages = calculateRowPercentages(matrixState.matrix, index);
        
        setMatrixState({
            ...matrixState,
            calculatedRowPercentages,
            hoveredSumRowIndex: index,
            hoveredCellId: null,
            nearestCellsId: [],
        });
    }

    const findNearestCellId = (cell: Cell | null) => {
        if (!cell) {
            setMatrixState({
                ...matrixState,
                hoveredCellId: null,
                nearestCellsId: [],
            });

            return;
        }

        const nearestCellsId: string[] = detectNearestCellsId(matrixState.matrix, cell, matrixState.nearestLimit);
        
        setMatrixState({
            ...matrixState,
            nearestCellsId,
            hoveredCellId: cell.id,
            calculatedRowPercentages:[],
            hoveredSumRowIndex: null,
        });
    }

    return (
        <MatrixState.Provider value={{
            matrixState,
            setMatrixState,
            generateMatrix,
            generateColumnsMedian,
            generateSumOfRows,
            incrementCellAmount,
            addRow,
            deleteMatrixRow,
            calculateRowValuesPercentage,
            findNearestCellId
        }}>
            {children}
        </MatrixState.Provider>
    );
};

export const useMatrix = () => useContext(MatrixState);
