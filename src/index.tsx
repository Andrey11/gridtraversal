import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import { store } from './app/store';
import { Provider } from 'react-redux';
import App from './App';

import './index.module.scss';

const container: HTMLElement = document.getElementById('root') || new HTMLElement();
const root = createRoot(container);

console.log('Init - index');


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//        <Provider store={store}>
//          <App />
//        </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

serviceWorker.unregister();
