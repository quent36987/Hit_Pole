import PropTypes from 'prop-types';
import { Color } from '@material-ui/lab';

export interface IAlertProps {
    message: string;
    type: Color;
}

export interface IAlert extends IAlertProps {
    id: string;
}

const IAlertType = {
    message: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string
};

export interface IToast {
    open: (alert: IAlertProps) => void;
    openSuccess: (message: string) => void;
    openError: (message: string) => void;
    openInfo: (message: string) => void;
    close: (id: number) => void;
}

export { IAlertType };
