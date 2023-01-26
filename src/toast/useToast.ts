import { useContext } from 'react';
import { ToastContext } from './ToastContext';
import { IToast } from './interfaces';

export const useToast = (): IToast => useContext(ToastContext);
