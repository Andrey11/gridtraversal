import { PositionData } from "../maze/Maze.types";

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
