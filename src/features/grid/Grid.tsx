import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Cell from '../cell/Cell';
import { CellState } from '../cell/Cell.types';
import { convertToCellIndex, getAdjacentCellId, isBoundaryBorder } from '../maze/Maze.helpers';
import { 
    getMazeHeightSize, 
    getMazeMatrix, 
    getMazeWidthSize, 
    isMazeMatrixEmpty, 
    updateCell,
 } from '../maze/mazeSlice';
import styles from './Grid.module.scss';
import GridLine from './GridLine';

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

    const vLineLength: number = heightSize * 50;
    const hLineLength: number = widthSize * 50;

    const onCellClicked = (cellId: string, cellCls: string) => {
        console.log('clicked: ' + cellId);
        // const clsName: string = (event.target as HTMLDivElement).className;
        // cell: CellState;
        const ind: number = convertToCellIndex(cellId, widthSize);
        const myCell: CellState = {...matrix[ind]};
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

        dispatch(updateCell({cell: myCell, matrixIndex: ind}));
    }
    
    // const createCellUI = (cell: CellState) => {
    //     const xPos = cell.position ? cell.position.x : 0;
    //     const yPos = cell.position ? cell.position.y : 0;
    //     // const positionCls: string = "p_" + xPos + "-" + yPos;
    //     const positionLabel = xPos + ", " + yPos;
    //     const cellId = xPos + "_" + yPos;

    //     // console.log(`createCellUI called: cellId:  ${cell.positionLabel}`);
    //     // const cellCls = ["Cell", positionCls];

    //     // if (cell.isStartCell) {
    //     //     cellCls.push("StartCell");
    //     // }
    //     // if (cell.isEndCell) {
    //     //     cellCls.push("EndCell");
    //     // }

    //     // if (!cell.up) {
    //     //     cellCls.push("uWall", "uWallBoundary");
    //     // }
    //     // if (!cell.down) {
    //     //     cellCls.push("dWall", "dWallBoundary");
    //     // }
    //     // if (!cell.left) {
    //     //     cellCls.push("lWall", "lWallBoundary");
    //     // }
    //     // if (!cell.right) {
    //     //     cellCls.push("rWall", "rWallBoundary");
    //     // }

    //     // const cellDiv = cellNode.childNodes.item(0).nextSibling as HTMLDivElement;
    //     // cellDiv.id = positionCls;
    //     // cellDiv.classList.add(...cellCls);
    //     // const cellPosLabelDiv = document.createElement("div");
    //     // cellPosLabelDiv.classList.add("positionLabel");
    //     // cellPosLabelDiv.appendChild(document.createTextNode(positionLabel));
    //     // const cellInfo = cellDiv.getElementsByClassName("cell-info")[0];
    //     // cellInfo.insertBefore(cellPosLabelDiv, cellInfo.firstChild);

    //     // cellDiv.onclick = (event) => {
    //     //     const clsName = (event.target as HTMLDivElement).className;
    //     //     updateCellUIBorderState(positionCls, clsName);
    //     // };

    //     return (<Cell key={positionLabel} cellId={cellId} cell1={cell} onCellClicked={onCellClicked}/>);
    // };

    const createGridLine = (key: number, x1: number, x2: number, y1: number, y2: number) => {
        return <GridLine key={key} x1={x1} x2={x2} y1={y1} y2={y2} />;
    };

    const createGridLines = () => {
        let lines = [];
        for(let i=1; i<heightSize; i++) {
            const xPos = i*50;
            lines.push({ x1: xPos, x2: xPos, y1: 0, y2: vLineLength });
        }
        for (let i = 1; i < widthSize; i++) {
            const yPos = i * 50;
            lines.push({ x1: 0, x2: hLineLength, y1: yPos, y2: yPos });
        }

        return lines.map((line, index) => createGridLine(index, line.x1, line.x2, line.y1, line.y2));
    }

    return (
        <div className={styles.GridWrapper}>
            <div className={styles.GridBoundary}>
                <div id="gridContainer" className={`${styles.Grid} ${styles['width__' + widthSize]}`}>
                    {/* {matrix.map((cell: CellState) => createCellUI(cell))} */}
                    {!isEmptyMatrix && matrix.map((cell: CellState, index) => <Cell key={index} cellId={cell.position?.x + '_' + cell.position?.y} cell1={cell} onCellClicked={onCellClicked} />)}
                </div>
            </div>
            <div className={styles.GridLines}>
                <svg id="gridLines" height={vLineLength} width={hLineLength}>
                    {!isEmptyMatrix && createGridLines()}
                </svg>
            </div>
        </div>

    );
};

export default Grid;




