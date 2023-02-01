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
                Dupliquer un cours
            </div>
            ou
            <div className="duplication-choix" onClick={toWeek}>
                Dupliquer une semaine ou une partie
            </div>
        </div>
    );
};

export { MainPage };
