import React from 'react';
import './toast.css';
import PropTypes from 'prop-types';
import { IAlert, IAlertType } from './interfaces';
import { useTimeout } from '../hooks/useTimeout';
import { Alert } from '@material-ui/lab';

interface IProps {
    alert: IAlert;
    close: Function;
}

const Toast = (props: IProps): JSX.Element => {
    useTimeout(props.close, 3000);

    return (
        <div className="my-toast">
            <Alert severity={props.alert.type}>{props.alert.message}</Alert>
        </div>
    );
};

Toast.propTypes = {
    alert: PropTypes.shape(IAlertType).isRequired,
    close: PropTypes.func.isRequired
};

export { Toast };
