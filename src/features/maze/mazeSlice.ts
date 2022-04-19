import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { MazeState } from './Maze.types';
import { CellState } from '../cell/Cell.types'
import { mazeTraversal } from './Maze.helpers';

export const initialMazeState: MazeState = {
    matrix: [],
    widthSize: 0,
    heightSize: 0,
    start: {x: 0, y: 0},
    end: { x: 0, y: 0 },
    selectedPath: '',
    paths: [],
    resultScreenWidthType: 0,
    calculating: false,
};

export type UpdateCellType = {
    cell: CellState;
    matrixIndex: number;
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const traverseMazeLogic = createAsyncThunk(
    'maze/mazeTraversal',
    async (maze: MazeState) => {
        const response = await mazeTraversal(maze.matrix, maze.widthSize, maze.heightSize, maze.start, maze.end);
        // The value we return becomes the `fulfilled` action payload
        return response;
    }
);

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
        updateMazeWidth: (state, action: PayloadAction<number>) => {
            state.widthSize = action.payload;
        },
        updateMazeHeight: (state, action: PayloadAction<number>) => {
            state.heightSize = action.payload;
        },
        updateCell: (state: MazeState, action: PayloadAction<UpdateCellType>) => {
            state.matrix[action.payload.matrixIndex] = action.payload.cell;
        },
        beginMazeTraversal: (state: MazeState, action: PayloadAction<boolean>) => {
            state.calculating = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(traverseMazeLogic.pending, (state: MazeState) => {
                state.calculating = true;
                console.log('pending');
            })
            .addCase(traverseMazeLogic.fulfilled, (state: MazeState, action) => {
                state.calculating = false;
                console.log('fulfilled');
                state.paths = action.payload.solutions;
            })
            .addCase(traverseMazeLogic.rejected, (state: MazeState) => {
                state.calculating = false;
                console.log('rejected');
                state.paths = ['error'];
            });
    },
});

export const { createMaze, setMazeMatrix, updateCell, beginMazeTraversal, updateMazeWidth, updateMazeHeight } = mazeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getMaze = (state: RootState) => state.maze;
export const getMazeMatrix = (state: RootState) => state.maze.matrix;
export const isMazeMatrixEmpty = (state: RootState) => state.maze.matrix.length === 0;
export const isCalculating = (state: RootState) => state.maze.calculating;
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
