import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { MazeState } from './Maze.types';
import { CellState } from '../cell/Cell.types'
import { createMatrix, createPosition } from './Maze.helpers';

export const initialMazeState: MazeState = {
    matrix: createMatrix(4, 4),
    widthSize: 4,
    heightSize: 4,
    start: createPosition(0, 0),
    end: createPosition(3, 3),
    selectedPath: '',
    paths: [],
    resultScreenWidthType: 0,
};

export type UpdateCellType = {
    cell: CellState;
    matrixIndex: number;
};

export const mazeSlice = createSlice({
    name: 'maze',
    initialState: initialMazeState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setMazeMatrix: (state: MazeState, action: PayloadAction<CellState[]>) => {
            state.matrix = action.payload;
        },
        createMaze: (state, action: PayloadAction<MazeState>) => {
            state.matrix = action.payload.matrix;
            state.widthSize = action.payload.widthSize;
            state.heightSize = action.payload.heightSize;
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.selectedPath = action.payload.selectedPath;
            state.paths = action.payload.paths;
            state.resultScreenWidthType = action.payload.resultScreenWidthType;
        },
        updateCell: (state: MazeState, action: PayloadAction<UpdateCellType>) => {
            state.matrix[action.payload.matrixIndex] = action.payload.cell;
        }
    },
});

export const { createMaze, setMazeMatrix, updateCell } = mazeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getMaze = (state: RootState) => state.maze;
export const getMazeMatrix = (state: RootState) => state.maze.matrix;
export const isMazeMatrixEmpty = (state: RootState) => state.maze.matrix.length === 0;
export const getMazeWidthSize = (state: RootState) => state.maze.widthSize;
export const getMazeHeightSize = (state: RootState) => state.maze.heightSize;
export const getCellById = (state: RootState, cellId: string): CellState =>
    createSelector(getMazeMatrix, getMazeWidthSize, (mazeMatrix, numCellsPerRow) => {
        const cellIndex = cellId.split('_');
        let foundIndex: number = parseInt(cellIndex[0]) + parseInt(cellIndex[1]) * numCellsPerRow;
        return mazeMatrix[foundIndex];
    })(state);
export const getClassesForCell = (state: RootState, cellId: string): string[] => {
    const cell: CellState = getCellById(state, cellId);
    const cellClasses: string[] = ['Cell', 'Border'];

    if (cell.isStartCell) {
        cellClasses.push('StartCell');
    }
    if (cell.isEndCell) {
        cellClasses.push('EndCell');
    }

    if (!cell.up) {
        cellClasses.push('uWall', 'uWallBoundary');
    }
    if (!cell.down) {
        cellClasses.push('dWall', 'dWallBoundary');
    }
    if (!cell.left) {
        cellClasses.push('lWall', 'lWallBoundary');
    }
    if (!cell.right) {
        cellClasses.push('rWall', 'rWallBoundary');
    }
    return cellClasses;
};

export default mazeSlice.reducer;
