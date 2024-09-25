type CellId = string;
type CellValue = number;
type PercentageValue = number;
type PercentageFromMaxAmount = number;

export type Cell = {
    id: CellId,
    amount: CellValue
}

export type PercentageCell = Cell & {
    percentage: PercentageValue;
    percentageFromMaxAmount: PercentageFromMaxAmount;
}