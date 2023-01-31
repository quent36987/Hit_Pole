import React from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { DUPLICATION_PATH } from '../constants';

const MainPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = () => {
    const history = useHistory();

    const toWeek = (): void => {
        history.push(`/${DUPLICATION_PATH}/copy-week`);
    };

    const toCours = (): void => {
        history.push(`/${DUPLICATION_PATH}/cours`);
    };

    return (
        <div className="flex-col center">
            <div className="duplication-choix" onClick={toCours}>
                Dupliquer un cours sur plusieurs semaines
            </div>
            ou
            <div className="duplication-choix" onClick={toWeek}>
                Dupliquer un semaine ou une partie sur plusieurs semaines
            </div>
        </div>
    );
};

export { MainPage };
