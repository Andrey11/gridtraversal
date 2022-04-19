import { PositionData } from '../maze/Maze.types';

export type CellState = {
    positionLabel: string;
    position: PositionData;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    visited: boolean;
    value: string;
    isStartCell: boolean;
    isEndCell: boolean;
};

export type Move = {
    to: CellState;
    from: CellState;
};

export const DirectionNames = {
    DIRECTION_TOP: 'top',
    DIRECTION_BOTTOM: 'bottom',
    DIRECTION_LEFT: 'left',
    DIRECTION_RIGHT: 'right',
};

export type AdjacentDirectionType = typeof DirectionNames[keyof typeof DirectionNames]; 