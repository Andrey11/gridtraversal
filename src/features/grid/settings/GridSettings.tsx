import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createMaze, getMaze } from '../../maze/mazeSlice';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'

import styles from './GridSettings.module.scss';
import { MazeState } from '../../maze/Maze.types';
import { createMatrix } from '../../maze/Maze.helpers';

export type GridSettingsProps = {
    widthSize: string;
    heightSize: string;
    walls?: string[] | [];
};

const GridSettings: React.FunctionComponent<GridSettingsProps> = ({ widthSize, heightSize }: GridSettingsProps) => {
    const dispatch = useAppDispatch();

    const mazeState: MazeState = useAppSelector(getMaze);

    console.log('Called Settings: w:' + widthSize + ', h:' + heightSize);

    const [localWidth, setLocalWidth] = useState(widthSize);
    const [localHeight, setLocalHeight] = useState(heightSize);

    useEffect(() => {
        if (widthSize) {
            setLocalWidth(widthSize);
        }
    }, [widthSize]);

    useEffect(() => {
        if (heightSize) {
            setLocalHeight(heightSize);
        }
    }, [heightSize]);

    // const onWidthUpdated = (event: any) => {
    //     const widthValue: string = event.target.value;
    //     console.log('onWidthUpdated: ' + widthValue);
    //     setLocalWidth(widthValue);
    // }
    // const onHeightUpdated = (event: any) => {
    //     const heightValue: string = event.target.value;
    //     console.log('onHeightUpdated: ' + heightValue);
    //     setLocalHeight(heightValue);
    // }
    const onFormUpdated = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const { widthRange, heightRange } = event.target.elements;
        const myForm = event.currentTarget;
        console.log('myForm: ' + myForm.id);
        const myMaze = { ...mazeState };
        myMaze.widthSize = parseInt(widthRange.value);
        myMaze.heightSize = parseInt(heightRange.value);
        // dispatch(updateMazeWidth(parseInt(localWidth)));
        // dispatch(updateMazeHeight(parseInt(localHeight)));
        myMaze.matrix = createMatrix(parseInt(widthRange.value), parseInt(heightRange.value));
        myMaze.start = {x: 0, y: 0};
        myMaze.end = {x: myMaze.widthSize-1, y: myMaze.heightSize-1};
        dispatch(createMaze(myMaze));
    }

    const onRangeChanged = (event: any) => {
        const elementId: string = event.target.id;
        const elementValue: string = event.target.value;
        console.log('event.target.value: ' + event.target.value);
        console.log('event.target.id: ' + event.target.id);
        if (elementId === 'heightRange') {
            setLocalHeight(elementValue);
        }
        if (elementId === 'widthRange') {
            setLocalWidth(elementValue);
        }


    }

    return (
        <><div className={styles.GridSettings}>
            <Form onSubmit={onFormUpdated}>
                <InputGroup className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <InputGroup.Text id="basic-addon1">X</InputGroup.Text>
                    <Form.Control
                        type='number'
                        placeholder="0"
                        aria-label="0"
                        aria-describedby="basic-addon1"
                    />
                    <InputGroup.Text id="basic-addon2">Y</InputGroup.Text>
                    <Form.Control
                        type='number'
                        placeholder="0"
                        aria-label="0"
                        aria-describedby="basic-addon2"
                    />
                </InputGroup>
                <Form.Group controlId='widthRange'>
                    <Form.Label>{`Width Size = ${localWidth}`}</Form.Label>
                    <Form.Control type="range" min="1" max="10" onChange={onRangeChanged} value={localWidth} />
                </Form.Group>
                <Form.Group controlId='heightRange'>
                    <Form.Label>{`Height  Size = ${localHeight}`}</Form.Label>
                    <Form.Control type="range" min="1" max="10" onChange={onRangeChanged} value={localHeight} />
                </Form.Group>
                <Form.Range aria-label='something' min={0} max={10} />
                <Button type="submit">Submit form</Button>
            </Form>
        </div>
        </>
    );
};

export default GridSettings;




