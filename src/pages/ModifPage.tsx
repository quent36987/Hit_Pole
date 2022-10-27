import './allPage.css';
import { AppState } from '../Context';
import { db } from '../firebase';
import { IPage } from '../interfaces/page';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Item, ItemConverter, Niveaux, Titres } from '../data/Item';
import React, { useEffect, useState } from 'react';

const ModifPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const [item, setItem] = useState<Item>(null);
    const { setAlert } = AppState();
    const [validated, setValidated] = useState(false);
    const [update, setUpdate] = useState(false);

    const [titre, setTitre] = useState('');
    const [niveau, setNiveau] = useState('');
    const [desc, setDesc] = useState('');

    const [date, setDate] = useState('');

    const [temps, setTemps] = useState('');
    const [place, setPlace] = useState('');

    useEffect(() => {
        LoadData().catch(console.error);
    }, [props.name]);

    async function LoadData(): Promise<void> {
        const query = doc(db, 'calendrier', props.match.params.id).withConverter(ItemConverter);
        const docsnap = await getDoc(query);

        setTitre(docsnap.data().titre);
        setNiveau(docsnap.data().niveau);
        setDesc(docsnap.data().desc);

        const date = docsnap.data().date.toDate();

        // date to YYYY-MM-DDTHH:MM
        const dateString = `${date.getFullYear()}-${
            date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}T${
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;

        setDate(dateString);

        setTemps(docsnap.data().temps.toString());
        setPlace(docsnap.data().place.toString());
        setItem(docsnap.data());
        setUpdate(!update);
    }

    const handleSubmit = async (event): Promise<void> => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            try {
                // update doc
                item.titre = titre;
                item.niveau = niveau;
                item.desc = desc;
                item.date = Timestamp.fromDate(new Date(date));
                item.temps = Number(temps);
                item.place = Number(place);

                const collectionRef = doc(db, 'calendrier', props.match.params.id).withConverter(
                    ItemConverter
                );

                await setDoc(collectionRef, item, { merge: true });

                setAlert({
                    open: true,
                    message: 'Modification effectuée',
                    type: 'success'
                });
            } catch (error) {
                console.log(error);

                setAlert({
                    open: true,
                    message: 'Erreur lors de la modification',
                    type: 'error'
                });
            }
        }

        setValidated(true);
    };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
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
                                id="input-group-dropdown-1">
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
                        <Form.Control
                            as="textarea"
                            value={desc}
                            placeholder="Description"
                            required
                            rows={2}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>

                    <Row className="mb-3" style={{ marginRight: '1vw', marginLeft: '1vw' }}>
                        <Form.Label style={{ fontSize: '80%', marginBottom: '0px' }}>
                            Date
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="datetime-local"
                                placeholder="date"
                                onChange={(e) => setDate(e.target.value)}
                                value={date}
                            />
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
                    <Button variant="btn btn-outline-success" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export { ModifPage };
