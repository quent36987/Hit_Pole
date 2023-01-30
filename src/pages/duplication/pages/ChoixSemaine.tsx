import React, { useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import '../../allPage.css';
import { getMonday, getSemaine } from '../utils';

const ChoixSemaine: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const history = useHistory();
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [semaine, setSemaine] = useState<number>(0);

    const onSubmit = (e): void => {
        e.preventDefault();
        console.log(props);

        console.log('get', getMonday(semaine, annee), semaine);

        const monday = getMonday(semaine, annee);

        const location = {
            pathname: '/duplication/validationCopie',
            state: { monday }
        };

        history.push(location);
    };

    return (
        <div className="DuplicaPage">
            <h1>Selection de la semaine a dupliquer</h1>

            <Form onSubmit={onSubmit}>
                <Form.Label>Choix de lannée</Form.Label>
                <Form.Select value={annee} onChange={(e) => setAnnee(Number(e.target.value))}>
                    {[
                        new Date().getFullYear() - 1,
                        new Date().getFullYear(),
                        new Date().getFullYear() + 1
                    ].map((annee) => (
                        <option key={annee} value={annee}>
                            {annee}
                        </option>
                    ))}
                </Form.Select>

                <Form.Label>Choix de la semaine</Form.Label>
                <Form.Select value={semaine} onChange={(e) => setSemaine(Number(e.target.value))}>
                    {getSemaine(annee).map((annee, i) => (
                        <option key={i} value={i}>
                            {annee}
                        </option>
                    ))}
                </Form.Select>

                <button>Valider</button>
            </Form>
        </div>
    );
};

export { ChoixSemaine };
