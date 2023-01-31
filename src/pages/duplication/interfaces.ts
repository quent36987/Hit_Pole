import PropTypes from 'prop-types';

export interface IToggleItem<T> {
    item: T;
    id: number;
    toggle: boolean;
    label?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type TToggleItems<T> = Array<IToggleItem<T>>;
