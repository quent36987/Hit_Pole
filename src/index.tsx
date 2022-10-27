import 'bootstrap/dist/css/bootstrap.css';
import Application from './application';
import { Context } from './Context';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Context>
            <Application />
        </Context>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
