/* eslint-disable */
// Snack Component - https://material-ui.com/components/snackbars/
import { AppState } from '../Context';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React from 'react';

const Alert = () => {
    const { alert, setAlert } = AppState();

    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert({ open: false });
    };

    return (
        <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
            <MuiAlert
                onClose={handleCloseAlert}
                elevation={10}
                variant="filled"
                severity={alert.type}
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
