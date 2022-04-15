import React from 'react';
import styles from './App.module.scss';
import Header from './features/header/Header';
import Maze from './features/maze/Maze';

const App: React.FunctionComponent = () => {

  return (
    <div className={styles.App}>
      <Header />
      <Maze />
    </div>
  );
}

export default App;
