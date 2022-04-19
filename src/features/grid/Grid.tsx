import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Cell from '../cell/Cell';
import { CellState } from '../cell/Cell.types';
import { convertToCellIndex, getAdjacentCellId, isBoundaryBorder } from '../maze/Maze.helpers';
import {
    getMazeHeightSize,
    getMazeMatrix,
    getMazeWidthSize,
    isCalculating,
    isMazeMatrixEmpty,
    updateCell,
} from '../maze/mazeSlice';
import GridLine from './GridLine';
import Spinner from 'react-bootstrap/Spinner';

import styles from './Grid.module.scss';

export type GridProps = {
    matrix: CellState[];
    widthSize: number;
    heightSize: number;
}

const Grid: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const matrix: CellState[] = useAppSelector(getMazeMatrix);
    const isEmptyMatrix = useAppSelector(isMazeMatrixEmpty);
    const widthSize = useAppSelector(getMazeWidthSize);
    const heightSize = useAppSelector(getMazeHeightSize);
    const calculating = useAppSelector(isCalculating);

    // const vLineLength: number = heightSize * 50;
    // const hLineLength: number = widthSize * 50;

    const onCellClicked = (cellId: string, cellCls: string) => {
        console.log('clicked: ' + cellId);
        // const clsName: string = (event.target as HTMLDivElement).className;
        // cell: CellState;
        const ind: number = convertToCellIndex(cellId, widthSize);
        const myCell: CellState = { ...matrix[ind] };
        const isBoundary = isBoundaryBorder(cellId, cellCls, widthSize, heightSize);

        if (isBoundary) {
            return;
        }

        if (cellCls.indexOf('BorderTop') !== -1) {
            myCell.up = !myCell.up;
            const adjacentCellId: string = getAdjacentCellId(cellId, 'top');
            const adjacentInd: number = convertToCellIndex(adjacentCellId, widthSize);
            const adjacentCell: CellState = { ...matrix[adjacentInd] };
            adjacentCell.down = !adjacentCell.down;
            dispatch(updateCell({ cell: adjacentCell, matrixIndex: adjacentInd }));
        } else if (cellCls.indexOf('BorderLeft') !== -1) {
            myCell.left = !myCell.left;
            const adjacentCellId: string = getAdjacentCellId(cellId, 'left');
            const adjacentInd: number = convertToCellIndex(adjacentCellId, widthSize);
            const adjacentCell: CellState = { ...matrix[adjacentInd] };
            adjacentCell.right = !adjacentCell.right;
            dispatch(updateCell({ cell: adjacentCell, matrixIndex: adjacentInd }));
        } else if (cellCls.indexOf('BorderRight') !== -1) {
            myCell.right = !myCell.right;
            const adjacentCellId: string = getAdjacentCellId(cellId, 'right');
            const adjacentInd: number = convertToCellIndex(adjacentCellId, widthSize);
            const adjacentCell: CellState = { ...matrix[adjacentInd] };
            adjacentCell.left = !adjacentCell.left;
            dispatch(updateCell({ cell: adjacentCell, matrixIndex: adjacentInd }));
        } else if (cellCls.indexOf('BorderBottom') !== -1) {
            myCell.down = !myCell.down;
            const adjacentCellId: string = getAdjacentCellId(cellId, 'bottom');
            const adjacentInd: number = convertToCellIndex(adjacentCellId, widthSize);
            const adjacentCell: CellState = { ...matrix[adjacentInd] };
            adjacentCell.up = !adjacentCell.up;
            dispatch(updateCell({ cell: adjacentCell, matrixIndex: adjacentInd }));
        }

        dispatch(updateCell({ cell: myCell, matrixIndex: ind }));
    }

    const createGridLine = (key: number, x1: number, x2: number, y1: number, y2: number) => {
        return <GridLine key={key} x1={x1} x2={x2} y1={y1} y2={y2} />;
    };

    const createGridLines = () => {
        let lines = [];
        for (let i = 0; i < widthSize; i++) {
            const xPos = i * 50;
            lines.push({ x1: xPos, x2: xPos, y1: 0, y2: heightSize * 50 });
        }
        for (let i = 0; i < heightSize; i++) {
            const yPos = i * 50;
            lines.push({ x1: 0, x2: widthSize * 50, y1: yPos, y2: yPos });
        }

        return lines.map((line, index) => createGridLine(index, line.x1, line.x2, line.y1, line.y2));
    }

    console.log('Grid - isCalculating: ' + calculating);

    return (
        <div className={styles.GridWrapper}>
            <div className={styles.GridBoundary}>
                <div id="gridContainer" className={`${styles.Grid} ${styles['width__' + widthSize]}`}>
                    {/* {matrix.map((cell: CellState) => createCellUI(cell))} */}
                    {!isEmptyMatrix && matrix.map((cell: CellState, index) => <Cell key={index} cellId={cell.position?.x + '_' + cell.position?.y} cell1={cell} onCellClicked={onCellClicked} />)}
                </div>
            </div>
            <div className={styles.GridLines}>
                <svg id="gridLines" height={heightSize * 50} width={widthSize * 50}>
                    {!isEmptyMatrix && createGridLines()}
                </svg>
            </div>
            {calculating && <div className={styles.GridCalculatingOverlay}>
                <Spinner animation="border" variant="primary" />
            </div>}
        </div>
    );
};

export default Grid;




