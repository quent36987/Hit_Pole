import React from 'react';
import ReactDOM from 'react-dom';
import Application from './application';
import Context from './Context';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
    <React.StrictMode>
        <Context>
            <Application />
        </Context>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
