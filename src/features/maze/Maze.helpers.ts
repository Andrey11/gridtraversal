import { CellState, Move, AdjacentDirectionType, DirectionNames } from '../cell/Cell.types';
import { MoveDirection, PositionData } from './Maze.types';

export const isBoundaryBorder = (
    cellId: string,
    directionCls: string,
    widthSize: number,
    heightSize: number): boolean => {

    const cellIndex = cellId.split('_');
    if (directionCls.indexOf('BorderTop') !== -1) {
        return parseInt(cellIndex[1]) === 0;
    } else if (directionCls.indexOf('BorderLeft') !== -1) {
        return parseInt(cellIndex[0]) === 0;
    } else if (directionCls.indexOf('BorderRight') !== -1) {
        return (parseInt(cellIndex[0]) + 1) === widthSize;
    } else if (directionCls.indexOf('BorderBottom') !== -1) {
        return (parseInt(cellIndex[1]) + 1) === heightSize;
    }
    return false;
};

export const createPosition = (x: number, y: number): PositionData => {
    return { x, y } as PositionData;
};

export const createMatrix = (width: number, height: number): CellState[] => {
    let matrix: CellState[] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell: CellState = {
                positionLabel: 'p_' + x + '-' + y,
                position: createPosition(x, y),
                up: y > 0,
                down: y + 1 < height,
                left: x > 0,
                right: x + 1 < width,
                visited: false,
                value: (y === 0 && x === 0) ? 'S' : y === height - 1 && x === width - 1 ? 'E' : '',
                isStartCell: y === 0 && x === 0,
                isEndCell: y === height - 1 && x === width - 1,
            };
            matrix.push(cell);
        }
    }

    return matrix;
};

export const convertToCellIndex = (cellId: string, numCellsPerRow: number): number => {
    const cellIndex = cellId.split('_');
    return parseInt(cellIndex[0]) + parseInt(cellIndex[1]) * numCellsPerRow;
};

export const getAdjacentCellId = (cellId: string, direction: AdjacentDirectionType): string => {
    const cellIndex = cellId.split('_');
    if (direction === DirectionNames.DIRECTION_LEFT) {
        return ((parseInt(cellIndex[0]) - 1) + '_' + cellIndex[1]);
    } else if (direction === DirectionNames.DIRECTION_RIGHT) {
        return ((parseInt(cellIndex[0]) + 1) + '_' + cellIndex[1]);
    } else if (direction === DirectionNames.DIRECTION_TOP) {
        return (cellIndex[0] + '_' + (parseInt(cellIndex[1]) - 1));
    } else if (direction === DirectionNames.DIRECTION_BOTTOM) {
        return (cellIndex[0] + '_' + (parseInt(cellIndex[1]) + 1));
    } else {
        return cellId;
    }

};

/**
 * 
 export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}
 */

// export const traverseMaze = (mazeState: MazeState) => {
    // event.preventDefault();

    // resetMatrixVisitedState();
    // clearResultPanel();
    // clearGridUISelectedCells();
    // mazeState.selectedPath = '';
    // let traverseControls = event.target.parentNode;
    // traverseControls.classList.add('searching');

//     setTimeout(() => {
//         let resultPromise = mazeTraversal(
//             mazeState.matrix,
//             mazeState.widthSize,
//             mazeState.heightSize,
//             mazeState.start,
//             mazeState.end
//         );

//         resultPromise.then((...opts) => {
//             console.log('Resolved');
//             // traverseControls.classList.remove('searching');
//             // saveResult();
//         });
//     }, 300);
// };

/**
 * Returns a promise that is resolved when all possible solutions are found.
 *
 * @param {Cell[]} grid grid state data object
 * @param {number} gridWidth width of the grid (x coord)
 * @param {number} gridHeight height of the grid (y coord)
 * @param {PositionData} start starting cell x,y coordinates
 * @param {PositionData} end ending cell x,y coordinates
 *
 * @returns {Promise} promise that will resolve when all solutions are found
 */
export const mazeTraversal = (
    grid: CellState[],
    gridWidth: number,
    gridHeight: number,
    start: PositionData = {x: 0, y: 0},
    end: PositionData = { x: gridWidth-1, y: gridHeight-1 },
) => {
    
    
    return new Promise<{ solutions: string[] }>((resolve, reject) => {
        const myGrid = grid.map((cell: CellState) => {return {...cell}});
        let startIndex = gridWidth * start.y + start.x;
        let stack: Move[] = [];
        let successPaths: string[] = [];
        let path: string[] = [];
        let foundCount = 0;

        let mv: Move = { to: myGrid[startIndex], from: myGrid[startIndex] };
        stack.push(mv);

        console.log('Solving maze: wxh = ' + gridWidth + 'x' + gridHeight);

        while (stack.length > 0) {
            let cellMove = stack.shift();
            if (cellMove) {
                let cell:CellState = cellMove.to || cellMove.from;
                let availableCells: Move[] = [];
    
                // found a solution
                if (cell.position.x === end.x && cell.position.y === end.y) {
                    foundCount++;
                    cell.visited = true;
                    path.push(cell.positionLabel);
                    let steps = path.length;
                    let str = steps + '|' + path.join(', ');
                    successPaths.push(str);
                } else if (!cell.visited) {
                    cell.visited = true;
                    path.push(cell.positionLabel);
                    // fetch all available moves
                    availableCells = getAvailableMoves(myGrid, cell, gridWidth);
                    // insert in front of all moves on stack
                    stack = availableCells.concat(stack);
                }
                // check if current cell has available moves
                let hasMoves = availableCells.length > 0;
                if (!hasMoves) {
                    // has no moves... Why?
                    // Two reasons, last visited cell was either:
                    // #1 exit/end/solution cell
                    // #2 has no available moves, in other words are stuck
                    // In both cases we want to backtrack to the next item on the stack
                    let nextMove = stack && stack.length > 0 ? stack[0] : null;
                    walkbackToNextAvailableCell(myGrid, path, nextMove);
                }
            }
        }

        // showResultsPanel(successPaths, true);

        console.log('Found paths: ' + foundCount);
        console.log('End: ' + path.toString());
        resolve({ solutions: successPaths });
    });
};

/**
 * Returns available move from cell to cell at direction
 * if such cell exists, and there is no wall between two cells,
 * and cell at direction has not been visited.
 *
 * @param {Cell[]} grid grid state data object
 * @param {number} gridWidth current grid width 
 * @param {Cell} cell current cell (aka from cell)
 * @param {MoveDirection} direction direction to next cell
 *
 * @returns {Move} available move for a given direction or null
 */
const getMoveForDirection = (
    grid: CellState[],
    gridWidth: number,
    cell: CellState,
    direction: MoveDirection
): Move | null => {
    let xOffset = cell.position.x;
    let yOffset = cell.position.y;
    let isBlocked = false;

    if (direction === 'up') {
        yOffset -= 1;
        isBlocked = !cell.up;
    } else if (direction === 'down') {
        yOffset += 1;
        isBlocked = !cell.down;
    } else if (direction === 'left') {
        xOffset -= 1;
        isBlocked = !cell.left;
    } else if (direction === 'right') {
        xOffset += 1;
        isBlocked = !cell.right;
    }

    // let offset = mazeState.widthSize * yOffset + xOffset;
    let offset = gridWidth * yOffset + xOffset;
    let adjacentCell: CellState = grid[offset];

    if (!isBlocked && adjacentCell && !adjacentCell.visited) {
        return { to: adjacentCell, from: cell };
    }

    return null;
};

/**
 * Returns a list of available moves from current cell,
 * or an empty list if no available moves found.
 *
 * @param {Cell[]} grid grid state data object
 * @param {Cell} cell current cell (aka from cell)
 * @param {number} gridWidth current grid width
 *
 * @returns {Move[]} available moves from given cell
 */
const getAvailableMoves = (grid: CellState[], cell: CellState, gridWidth: number): Move[] | [] => {
    let availCells: Move[] = [];
    const upMove = getMoveForDirection(grid, gridWidth, cell, 'up');
    const downMove = getMoveForDirection(grid, gridWidth, cell, 'down');
    const leftMove = getMoveForDirection(grid, gridWidth, cell, 'left');
    const rightMove = getMoveForDirection(grid, gridWidth, cell, 'right');

    if (upMove) {
        availCells.push(upMove);
    }
    if (downMove) {
        availCells.push(downMove);
    }
    if (leftMove) {
        availCells.push(leftMove);
    }
    if (rightMove) {
        availCells.push(rightMove);
    }
    
    return availCells;
};

/**
 * Walks backwards along pathToWalkback path until a match is found
 * or path has been fully traversed.
 * Each traversed item is removed from pathToWalkback,
 * and sets visited=false for each corresponding cell in grid.
 *
 * @param {Cell[]} grid grid state data object
 * @param {string[]} pathToWalkback ordered list of position labels in path
 * @param {Move} nextMove target and desination cell refs
 */
const walkbackToNextAvailableCell = (
    grid: CellState[],
    pathToWalkback: string[],
    nextMove: Move | null
) => {
    if (nextMove === null || nextMove === undefined) {
        return;
    }
    if (!pathToWalkback || (pathToWalkback && pathToWalkback.length < 2)) {
        return;
    }
    let cellIdToReset = pathToWalkback.pop();
    let backtrack = true;
    while (backtrack && pathToWalkback && pathToWalkback.length > 0) {
        // point to the previous position
        let previousCell = getCellByPosition(
            grid,
            pathToWalkback[pathToWalkback.length - 1]
        );
        let found = false;
        if (previousCell && nextMove.from.positionLabel === previousCell.positionLabel) {
            let targetCell = getCellByPosition(grid, nextMove.to.positionLabel || '');
            found = !targetCell?.visited;
        }

        let resetCell = getCellByPosition(grid, cellIdToReset || '') || {visited: false};
        resetCell.visited = false;

        if (!found) {
            cellIdToReset = pathToWalkback.pop();
            backtrack = true;
        } else {
            backtrack = false;
        }
    }
};


/**
 * Returns found cell data object or null otherwise.
 *
 * @param {Cell[]} grid grid state data object
 * @param {string} pos cell position label p_X-Y
 *
 * @returns {Cell} found cell or null
 */
const getCellByPosition = (grid: CellState[], pos: string): CellState | undefined => {
    const found = grid.find((cell) => cell.positionLabel === pos);
    return found;
};
