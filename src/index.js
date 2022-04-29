import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './AppRouter';
import { BrowserRouter } from 'react-router-dom';
import ContextProvider from './context/ContextProvider';

ReactDOM.render(
  <ContextProvider>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </ContextProvider>,

  document.getElementById('root')
);
