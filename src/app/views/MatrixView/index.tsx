import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@components/common/Button";

import { Cell } from "@/enteties/matrix";
import { useMatrix } from "@app/providers/MatrixProvider";
import { LocalStorageKeys, getLocalStorageItem } from "@utils/storage";

import './index.scss'

const MatrixView = () => {
    const navigate = useNavigate();

    const [headingRow, setHeadingRow] = useState<number[]>([])
    const [headingColumn, setHeadingColumn] = useState<number[]>([])
    
    const {
        matrixState: {
            matrix,
            sumOfRows,
            columnsMedian,
            rowsAmount,
            columnsAmount,
            nearestLimit,
            hoveredCellId,
            nearestCellsId,
            calculatedRowPercentages,
            hoveredSumRowIndex,
            maxAmountOfHoveredRow
        },
        incrementCellAmount,
        generateSumOfRows,
        generateColumnsMedian,
        generateMatrix,
        addRow,
        deleteMatrixRow,
        calculateRowValuesPercentage,
        setMatrixState,
        findNearestCellId
    } = useMatrix();

    const getHeadingLabel = (isRow: boolean, index: number) => `${isRow ? 'Row' : 'Column'} ${index + 1}`;

    useEffect(() => {
        const generatedSum = generateSumOfRows();
        const generatedColumnsMedian = generateColumnsMedian();
        
        setMatrixState({
            matrix,
            rowsAmount,
            calculatedRowPercentages,
            hoveredSumRowIndex,
            columnsAmount,
            nearestLimit,
            hoveredCellId,
            nearestCellsId,
            sumOfRows: generatedSum,
            columnsMedian: generatedColumnsMedian,
            maxAmountOfHoveredRow
        });
    }, [matrix, rowsAmount, matrix.length]);

    useEffect(() => {
        setHeadingRow(Array.from(Array(rowsAmount).keys()));
    }, [rowsAmount]);
    
    useEffect(() => {
        const rowsAmountFromStorage: number = JSON.parse(getLocalStorageItem(LocalStorageKeys.ROWS_AMOUNT) || '');
        const columnsAmountFromStorage: number = JSON.parse(getLocalStorageItem(LocalStorageKeys.COLUMNS_AMOUNT) || '');
        const nearestLimitFromStorage: number = JSON.parse(getLocalStorageItem(LocalStorageKeys.NEAREST_LIMIT) || '');

        setHeadingColumn(Array.from(Array(columnsAmountFromStorage).keys()));

        generateMatrix(rowsAmountFromStorage, columnsAmountFromStorage, nearestLimitFromStorage);
    }, []);
  
    return (
        <div className="matrix-view">  
        <Button label="Go to home page" onConfirm={()=> navigate('/')} className="matrix-view__go-home"/>  
            <div className="matrix-view__content">
                {matrix.length ?
                    <table className="matrix-view__table">
                        <thead>
                            <tr>
                                <th/>
                                {headingColumn.map((column) => <th key={column}>{getHeadingLabel(false, column)}</th>)}
                                <th>Sum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, index) => (
                                <tr key={index}>
                                    <td>{ getHeadingLabel(true, headingRow[index]) }</td>
                                    {hoveredSumRowIndex === index ?
                                        calculatedRowPercentages.map((column, index) => (
                                            <td
                                                key={index}
                                                className="matrix-view__table__matrix-cell"
                                                style={{ background: `rgba(204, 129, 156, ${column.percentageFromMaxAmount}%`}}
                                            >
                                                {column.percentage}%
                                            </td>
                                        ))
                                        :   
                                        row.map((column: Cell) => {
                                            const isHovered = nearestCellsId.includes(column.id);
                                            
                                            return <td
                                                key={column.id}
                                                className={`matrix-view__table__matrix-cell ${isHovered ? 'hovered' : ''}`}
                                                onMouseEnter={() => findNearestCellId(column)}
                                                onMouseLeave={() => findNearestCellId(null)}
                                            >
                                                <button onClick={() => incrementCellAmount(column.id)}>
                                                    {column.amount}
                                                </button>
                                            </td>
                                        })}
                                    <td
                                        onMouseEnter={() => calculateRowValuesPercentage(index)}
                                        onMouseLeave={() => calculateRowValuesPercentage(null)}
                                        className="matrix-view__table__sum"
                                    >
                                        {sumOfRows[index]}
                                    </td>
                                    <td className="matrix-view__table__delete-button">
                                        <button onClick={() => deleteMatrixRow(index)} >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>50th percentile</td>
                                {columnsMedian.map((amount, index) =>
                                    <td key={index} className="matrix-view__table__percentage-cell">
                                        {amount}
                                    </td>
                                )}
                                <td/>
                            </tr>
                        </tbody>
                    </table>
                    :
                    <p className="matrix-view__no-items">No items</p>
                }
                <Button onConfirm={addRow} label="Add row"/>
            </div>
      </div>
  )
}

export default MatrixView;
