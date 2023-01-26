import React from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';

const ChoixType: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const history = useHistory();

    const toSemaine = (): void => {
        history.push('/duplication/semaine');
    };

    const toCours = (): void => {
        history.push('/duplication/cours');
    };

    return (
        <div className="flex-col center">
            <div className="duplication-choix" onClick={toCours}>
                Dupliquer un cours sur plusieurs semaines
            </div>
            ou
            <div className="duplication-choix" onClick={toSemaine}>
                Dupliquer un semaine ou une partie sur plusieurs semaines
            </div>
        </div>
    );
};

export { ChoixType };
