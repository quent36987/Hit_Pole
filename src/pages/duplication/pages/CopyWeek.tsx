import React, { useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import '../../allPage.css';
import { getMonday, getSemaine } from '../utils';
import { DUPLICATION_PATH } from '../constants';

const CopyWeek: React.FunctionComponent<IPage & RouteComponentProps<any>> = () => {
    const history = useHistory();

    const [year, setYear] = useState(new Date().getFullYear());
    const [week, setWeek] = useState<number>(0);

    const onSubmit = (e): void => {
        e.preventDefault();
        const monday = getMonday(week, year);

        history.push({
            pathname: `/${DUPLICATION_PATH}/copy-validation`,
            state: { monday }
        });
    };

    const years = [
        new Date().getFullYear() - 1,
        new Date().getFullYear(),
        new Date().getFullYear() + 1
    ];

    return (
        <div className="DuplicaPage">
            <h1>Selection de la semaine a dupliquer</h1>

            <Form onSubmit={onSubmit}>
                <Form.Label>Choix de lannée</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </Form.Select>

                <Form.Label>Choix de la semaine</Form.Label>
                <Form.Select value={week} onChange={(e) => setWeek(Number(e.target.value))}>
                    {getSemaine(year).map((annee, i) => (
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

export { CopyWeek };
