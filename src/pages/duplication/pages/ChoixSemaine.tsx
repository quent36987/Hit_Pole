import React, { useRef, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import '../../allPage.css';

const ChoixSemaine: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const inputRef = useRef(null);
    // const history = useHistory();
    const [annee, setAnnee] = useState(new Date().getFullYear());

    const onSubmit = (e): void => {
        e.preventDefault();
        console.log('value', inputRef.current.value);
        console.log(props);

        // history.push('/duplica/semaine');
    };

    return (
        <div className="DuplicaPage">
            <h1>Insert a new value</h1>
            <Form onSubmit={onSubmit}>
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

                <input ref={inputRef} type="date" />
                <button>Save new value</button>
            </Form>
        </div>
    );
};

export { ChoixSemaine };
