import React from 'react';
import styles from './Header.module.scss';

const Header: React.FunctionComponent = () => {

    return (
        <div className={styles.ScreenHeader}>
            <header>
                <button type="submit" id="options" className={`${styles.Btn} ${styles.BtnIcon}`}>&#9776;</button>
                <label>Maze Traversal</label>
            </header>
        </div>
    );
};

export default Header;