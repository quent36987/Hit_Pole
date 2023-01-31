import React, { useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './duplication.css';
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
        <div className="duplication-page flex-col center">
            <div className="duplication-titre">Sélection de la semaine à dupliquer</div>

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <div>{"Choix de l'année"}</div>
                    <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <div>Choix de la semaine</div>
                    <Form.Select value={week} onChange={(e) => setWeek(Number(e.target.value))}>
                        {getSemaine(year).map((annee, i) => (
                            <option key={i} value={i}>
                                {annee}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <button className="submit-button">Valider</button>
            </Form>
        </div>
    );
};

export { CopyWeek };
