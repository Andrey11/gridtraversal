import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import mazeReducer from '../features/maze/mazeSlice';
import gridReducer from '../features/grid/gridSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    maze: mazeReducer,
    grid: gridReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
