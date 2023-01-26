import 'bootstrap/dist/css/bootstrap.css';
import Application from './application';
import { Context } from './Context';
import React from 'react';
import ReactDOM from 'react-dom';
import ReportWebVitals from './reportWebVitals';
import { ToastProvider } from './toast';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <Context>
            <ToastProvider>
                <Application />
            </ToastProvider>
        </Context>
    </React.StrictMode>,
    document.getElementById('root')
);

ReportWebVitals();
