import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Grid from '../grid/Grid';
import {
    createMaze,
    getMaze,
    getMazeHeightSize,
    getMazeWidthSize,
    initialMazeState,
    // isCalculating,
    isMazeMatrixEmpty,
    traverseMazeLogic,
} from './mazeSlice';
import Button from 'react-bootstrap/Button';

import styles from './Maze.module.scss';
import GridSettings from '../grid/settings/GridSettings';
import { createMatrix, createPosition } from './Maze.helpers';

const Maze: React.FunctionComponent = () => {

    const dispatch = useAppDispatch();
    // const [loaded, setLoaded] = useState(false);

    const gridWidth = useAppSelector(getMazeWidthSize);
    const gridHeight = useAppSelector(getMazeHeightSize);
    const isEmptyGrid = useAppSelector(isMazeMatrixEmpty)
    const mazeState = useAppSelector(getMaze);
    // const calculating = useAppSelector(isCalculating);


    console.log('Maze main');

    useEffect(() => {
        if (isEmptyGrid) {
            console.log('Creating maze');
            // setLoaded(true);
            let myMaze = { ...initialMazeState };
            myMaze.matrix = createMatrix(4, 4);
            myMaze.widthSize = 4;
            myMaze.heightSize = 4;
            myMaze.start = createPosition(0, 0);
            myMaze.end = createPosition(3, 3);
            dispatch(createMaze(myMaze));
        }
    }, [dispatch, isEmptyGrid]);

    // useEffect(() => {
    //     if (calculating) {
    //         console.log('calculating state change');
    //         dispatch(traverseMazeLogic(mazeState));
    //     }
    // }, [dispatch, calculating]);


    const onResetClicked = () => {
        console.log('On Reset clicked');
        dispatch(createMaze(initialMazeState));
    }

    const onTraverseClicked = () => {
        console.log('On Traverse clicked');
        // dispatch(beginMazeTraversal(true));
        dispatch(traverseMazeLogic(mazeState));
    }

    // const maze: MazeState = useAppSelector(getMaze);
    // const clearAllNodeChildren = (node: HTMLElement) => {
    //     while (node && node.firstChild) {
    //         node.removeChild(node.firstChild);
    //     }
    // };

    // const createGridUI = (gridState: GridState) => {
    //     let gridContainer = document.getElementById("gridContainer");

    //     if (gridContainer) {
    //         gridContainer.classList.remove(...gridContainer.className.split(" "));
    //         clearAllNodeChildren(gridContainer);

    //         let widthSize: number = gridState.widthValue;
    //         let heightSize: number = gridState.heightValue;
    //         let start: PositionData = gridState.startPos;
    //         let end: PositionData = gridState.endPos;
    //         let walls: string[] = gridState.gridWalls;

    //         mazeState.matrix = createMatrix(widthSize, heightSize);
    //         let startIndex = start.y * widthSize + start.x;
    //         let startCell = mazeState.matrix[startIndex];
    //         startCell.value = "S";
    //         startCell.isStartCell = true;

    //         let endIndex = end.y * widthSize + end.x;
    //         let endCell = mazeState.matrix[endIndex];
    //         endCell.value = "E";
    //         endCell.isEndCell = true;

    //         gridContainer.classList.add("grid");
    //         gridContainer.classList.add("width-" + widthSize);

    //         for (let i = 0; i < mazeState.matrix.length; i++) {
    //             const cell: Cell = mazeState.matrix[i];
    //             const divCell = createCellUI(cell);
    //             gridContainer.appendChild(divCell);
    //         }

    //         mazeState.widthSize = widthSize;
    //         mazeState.heightSize = heightSize;
    //         mazeState.start = start;
    //         mazeState.end = end;

    //         createGridUIWalls(walls);

    //         createGridUILines();
    //     }
    // };

    // const createPosition = (x: number, y: number): PositionData => {
    //     const pos: PositionData = { x, y };
    //     return pos;
    // };

    // const createMatrix = (width: number, height: number): Cell[] => {
    //     let matrix: Cell[] = [];
    //     for (let y = 0; y < height; y++) {
    //         for (let x = 0; x < width; x++) {
    //             const cell: Cell = {
    //                 positionLabel: "p_" + x + "-" + y,
    //                 position: createPosition(x, y),
    //                 up: y > 0,
    //                 down: y + 1 < height,
    //                 left: x > 0,
    //                 right: x + 1 < width,
    //                 visited: false,
    //                 value: "",
    //                 isStartCell: false,
    //                 isEndCell: false
    //             };
    //             matrix.push(cell);
    //         }
    //     }

    //     return matrix;
    // };

    return (
        <div className={styles.MazePage}>
            <Grid />
            <div>
                <Button variant="secondary" onClick={onResetClicked}>Reset</Button>{' '}
                <Button variant="primary" onClick={onTraverseClicked}>Traverse</Button>{' '}
            </div>
            <GridSettings heightSize={gridHeight.toString()} widthSize={gridWidth.toString()} />
        </div>

    );
};

export default Maze;