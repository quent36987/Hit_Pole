import React, { useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './duplication.css';
import { getWeek } from '../utils';
import { DUPLICATION_PATH } from '../constants';

const CopyWeek: React.FunctionComponent<IPage & RouteComponentProps<any>> = () => {
    const history = useHistory();

    const [year, setYear] = useState(new Date().getFullYear());

    const [monday, setMonday] = useState<string>('');

    const onSubmit = (e): void => {
        e.preventDefault();

        history.push({
            pathname: `/${DUPLICATION_PATH}/copy-validation`,
            state: { monday: new Date(monday) }
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
                    <Form.Select value={monday} onChange={(e) => setMonday(e.target.value)}>
                        <option key={-1} value={''}>
                            ....
                        </option>
                        {getWeek(year).map((week, i) => (
                            <option key={week.id} value={week.item.toString()}>
                                {week.label}
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
