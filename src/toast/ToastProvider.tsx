import React, { useState, useMemo } from 'react';
import './toast.css';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';
import { IAlert, IAlertProps } from './interfaces';
import { generateUEID } from '../Utils/maths';

// eslint-disable-next-line react/prop-types
export const ToastProvider = ({ children }): JSX.Element => {
    const [toasts, setToasts] = useState<IAlert[]>([]);

    const open = (content: IAlertProps): void => {
        setToasts((currentToasts) => [{ id: generateUEID(), ...content }, ...currentToasts]);
    };

    const openSuccess = (message: string): void => {
        setToasts((currentToasts) => [
            { id: generateUEID(), type: 'success', message },
            ...currentToasts
        ]);
    };

    const openError = (message: string): void => {
        setToasts((currentToasts) => [
            { id: generateUEID(), type: 'error', message },
            ...currentToasts
        ]);
    };

    const close = (id): void => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    };

    const contextValue = useMemo(() => ({ open, openSuccess, openError }), []);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="toasts-wrapper">
                {toasts.map((toast) => (
                    <Toast key={toast.id} alert={toast} close={() => close(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
