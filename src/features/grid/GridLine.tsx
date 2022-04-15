import React from 'react';
// import styles from './Cell.module.scss';
import { GridLineProps } from './Grid.types';

const GridLine: React.FunctionComponent<GridLineProps> = ({
    x1, x2,
    y1, y2
}: GridLineProps) => {

    return (<line x1={x1} x2={x2} y1={y1} y2={y2} />);
};

export default GridLine;







