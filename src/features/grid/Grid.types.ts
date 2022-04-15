import { PositionData } from "../maze/Maze.types";

export type RandomWallType =
    | "randomWallsSmall"
    | "randomWallsNone"
    | "randomWallsLarge"
    | "randomWallsCustom";

export type GridState = {
    widthValue: number;
    heightValue: number;
    startPos: PositionData;
    endPos: PositionData;
    randomWallType: RandomWallType;
    gridWalls: string[];
};

export type GridLineProps = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}