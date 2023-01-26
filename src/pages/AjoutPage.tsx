import './allPage.css';
import { AppState } from '../Context';
import { IPage } from '../interfaces/page';
import { Timestamp } from 'firebase/firestore';
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';
import { getEmptyItem, Niveaux, Titres } from '../data/Item';
import React, { useState } from 'react';
import { addItem } from '../Utils/firebase/firebasePut';
import { useToast } from '../toast';

const AjoutPage: React.FunctionComponent<IPage> = (props) => {
    const { user } = AppState();
    const toast = useToast();
    const [isValidated, setIsValidated] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [titre, setTitre] = useState('');
    const [niveau, setNiveau] = useState('');
    const [desc, setDesc] = useState('');

    const [dates, setDates] = useState([]);

    const [temps, setTemps] = useState('');
    const [place, setPlace] = useState('');

    const handleSubmit = async (event): Promise<void> => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            if (dates.length === 0) {
                toast.openError('Veuillez ajouter au moins une date');

                return;
            }

            try {
                for (let i = 0; i < dates.length; i++) {
                    const item = getEmptyItem(
                        titre,
                        desc,
                        Timestamp.fromDate(new Date(dates[i])),
                        Number(temps),
                        Number(place),
                        niveau
                    );

                    await addItem(item, user.uid);
                }

                toast.openSuccess('ajouté avec succès');
            } catch (error) {
                toast.openError(error.message);
            }
        }

        setIsValidated(true);
    };

    return (
        <div>
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
                <Form.Group>
                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                            Titre
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={titre}
                                placeholder="Titre"
                                required
                                onChange={(e) => setTitre(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Titre.
                            </Form.Control.Feedback>
                            <DropdownButton
                                variant="outline-secondary"
                                title=""
                                id="input-group-dropdown-1">
                                {Titres.map((t, i) => (
                                    <Dropdown.Item key={i} onClick={() => setTitre(t)}>
                                        {t}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </InputGroup>
                    </Row>

                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                            Niveau
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                value={niveau}
                                onChange={(e) => {
                                    setNiveau(e.target.value);
                                }}
                                required
                                placeholder="Niveau"
                            />

                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Niveau.
                            </Form.Control.Feedback>
                            <DropdownButton
                                variant="outline-secondary"
                                title=""
                                id="input-group-dropdown-2">
                                {Niveaux.map((t, i) => (
                                    <Dropdown.Item key={i} onClick={() => setNiveau(t)}>
                                        {t}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </InputGroup>
                    </Row>
                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                            Commentaire
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                as="textarea"
                                value={desc}
                                placeholder="Commentaire"
                                required
                                rows={2}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Titre.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Row>

                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                            Date
                        </Form.Label>
                        {dates.map((d, index) => {
                            return (
                                <InputGroup key={index}>
                                    <Form.Control
                                        type="datetime-local"
                                        value={d}
                                        placeholder="Date"
                                        required
                                        onChange={(e) => {
                                            const d = dates;
                                            d[index] = e.target.value;
                                            setDates(d);
                                            setIsUpdate(!isUpdate);
                                        }}
                                    />
                                    <Button
                                        variant="outline-danger"
                                        onClick={() => {
                                            const d = dates;
                                            d.splice(index, 1);
                                            setDates(d);
                                            setIsUpdate(!isUpdate);
                                        }}>
                                        🗑️
                                    </Button>
                                </InputGroup>
                            );
                        })}
                    </Row>

                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <InputGroup>
                            <Button
                                variant="outline-secondary"
                                id="button-addon1"
                                onClick={(e) => {
                                    const d = dates;
                                    d.push('');
                                    setDates(d);
                                    console.log(dates);
                                    setIsUpdate(!isUpdate);
                                }}>
                                Ajouter une date
                            </Button>
                        </InputGroup>
                    </Row>

                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Col>
                            <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                                Temps
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={temps}
                                placeholder="Minute"
                                required
                                onChange={(e) => setTemps(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Titre.
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                                Place
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={place}
                                placeholder="Place"
                                required
                                onChange={(e) => setPlace(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Titre.
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <InputGroup>
                            <Button variant="btn btn-outline-success" type="submit">
                                Submit
                            </Button>
                        </InputGroup>
                    </Row>
                </Form.Group>
            </Form>
        </div>
    );
};

export { AjoutPage };
