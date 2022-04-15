import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { GridState } from './Grid.types';

const initialState: GridState = {
    widthValue: 3,
    heightValue: 3,
    startPos: {x: 1, y: 1},
    endPos: {x: 3, y: 3},
    randomWallType: 'randomWallsNone',
    gridWalls: [],
};

export const gridSlice = createSlice({
    name: 'grid',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setGrid: (state, action: PayloadAction<GridState>) => {
            state = action.payload;
        },
    },
});

export const { setGrid } = gridSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getGrid = (state: RootState) => state.grid;


export default gridSlice.reducer;
