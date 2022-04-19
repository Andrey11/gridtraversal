import { CellState } from '../cell/Cell.types';

export type PositionData = {
    x: number;
    y: number;
};

export type MazeState = {
    matrix: CellState[];
    widthSize: number;
    heightSize: number;
    start: PositionData;
    end: PositionData;
    selectedPath: string;
    paths: string[];
    resultScreenWidthType: number;
    calculating: boolean;
    loading?: boolean;
};

export type MoveDirection = 'up' | 'down' | 'left' | 'right';