import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { getClassesForCell } from '../maze/mazeSlice';
import { CellState } from './Cell.types';

import styles from './Cell.module.scss';

export type CellProps = {
    cellId: string;
    onCellClicked: (cellId: string, clsName: string) => void;
    cell1: CellState
}

// export const getClassForCell

const Cell: React.FunctionComponent<CellProps> = ({ cellId, onCellClicked }: CellProps) => {
    const classList: string[] = useSelector((state: RootState) => getClassesForCell(state, cellId)); 
    const getClassListStyles = (clsItems: string[]): string => {
        return clsItems.map((cls) => styles[cls]).join(' ')
    };

    const onCellClickedInternal = (evt: any) => {
        const clsName: string = (evt.target as HTMLDivElement).className;
        onCellClicked(cellId, clsName);
    };

    return (
        <div data-cellid={cellId} className={getClassListStyles(classList)} onClick={onCellClickedInternal}>
            <div className={styles.DirectionInfo}>
                <svg height="50" width="50">
                    <line x1="25" y1="0" x2="25" y2="25" className={styles.Direction__up} />
                    <line x1="25" y1="25" x2="50" y2="25" className={styles.Direction__right} />
                    <line x1="25" y1="25" x2="25" y2="50" className={styles.Direction__down} />
                    <line x1="0" y1="25" x2="25" y2="25" className={styles.Direction__left} />
                </svg>
            </div>
            <div className={styles.CellInfo}>
                <span className={styles.CellValue}></span>
            </div>
            <div className={styles.BorderTop}></div>
            <div className={styles.BorderLeft}></div>
            <div className={styles.BorderRight}></div>
            <div className={styles.BorderBottom}></div>
        </div>
    );
};

export default Cell;