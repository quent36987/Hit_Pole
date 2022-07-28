import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import { AppState } from '../Context';
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemConverter, Niveaux, Titres, TYPE_COURS } from '../data/Item';




const AjoutPage: React.FunctionComponent<IPage> = props => {

    const { setAlert } = AppState();
    const [validated, setValidated] = useState(false);
    const [update, setUpdate] = useState(false);

    const [titre, setTitre] = useState("");
    const [niveau, setNiveau] = useState("");
    const [desc, setDesc] = useState("");

    const [dates, setDates] = useState([]);
    const [date, setDate] = useState("");

    const [temps, setTemps] = useState("");
    const [place, setPlace] = useState("");


    useEffect(() => {
        logging.info(`Loading ${props.name}`);
    }, [props.name])


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            if (dates.length === 0) {
                setAlert({
                    open: true,
                    message: "Veuillez ajouter au moins une date",
                    type: "error",
                });
                return;
            }

            try {
                for(let i = 0; i < dates.length; i++) {
                    var item = new Item(titre,desc,Timestamp.fromDate(new Date(dates[i])),
                    Number(temps),Number(place),"",[],TYPE_COURS.COURS,1,niveau);
                    
                    const collectionRef = collection(db, "calendrier").withConverter(ItemConverter);
                    await addDoc(collectionRef, item);
                   
                }
                setAlert({
                        open: true,
                        message: "ajouté avec succès",
                        type: "sucess",
                });
            } 
            catch (error) {
                setAlert({
                    open: true,
                    message: error.message,
                    type: "danger",
                });
            }
            

        }
        setValidated(true);
    };

    return (
        <div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group controlId="formBasicEmail">
                    
                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                    <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Titre</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" value={titre} placeholder="Titre" required
                            onChange={(e) => setTitre(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                        <DropdownButton
          variant="outline-secondary"
          title=""
          id="input-group-dropdown-1"
        >
          {Titres.map((t, i) => <Dropdown.Item key={i} onClick={() => setTitre(t)}>{t}</Dropdown.Item>)}
        </DropdownButton>
                    </InputGroup>
                    </Row>
                    
                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Niveau</Form.Label>
                        <InputGroup>
                        <Form.Control type="text" value={niveau}
                            onChange={(e) => { setNiveau(e.target.value) }}
                            required
                            placeholder="Niveau"
                        />
                        
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Niveau.
                        </Form.Control.Feedback>
                        <DropdownButton
          variant="outline-secondary"
          title=""
          id="input-group-dropdown-1"
        >
          {Niveaux.map((t, i) => <Dropdown.Item key={i} onClick={() => setNiveau(t)}>{t}</Dropdown.Item>)}
        </DropdownButton>

                        </InputGroup>
                    </Row>
                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Description</Form.Label>
                        <Form.Control as="textarea" value={desc} placeholder="Description" required
                            rows={2}
                            onChange={(e) => setDesc(e.target.value)} />
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>

                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Date</Form.Label>
                        {dates.map((d, index) => {
                            return (
                                <InputGroup key={index}>
                                    <Form.Control type="datetime-local" value={d} placeholder="Date" required
                                        onChange={(e) => {
                                            var d = dates; d[index] = e.target.value; setDates(d);
                                            console.log(dates);
                                            setUpdate(!update);
                                        }} />
                                    <Button variant="outline-danger" onClick={() => {
                                        var d = dates; d.splice(index, 1); setDates(d);
                                        setUpdate(!update);
                                    }
                                    }>🗑️</Button>
                                </InputGroup>
                            )
                        }
                        )}
                    </Row>
                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                        <InputGroup>
                            <Form.Control type="datetime-local" placeholder="date"
                                onChange={(e) => setDate(e.target.value)} />
                            <Button variant="outline-secondary" id="button-addon1"
                                onClick={(e) => {
                                    var d = dates; d.push(date); setDates(d); console.log(dates)
                                    setUpdate(!update);
                                }}

                            >
                                Ajouter la date
                            </Button>
                        </InputGroup>

                    </Row>
                    <Row className="mb-3" style={{ "marginRight": "1vw", "marginLeft": "1vw" }}>
                        <Col>
                            <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Temps</Form.Label>
                            <Form.Control type="number" value={temps} placeholder="Minute" required
                                onChange={(e) => setTemps(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Veuillez entrer un Titre.
                            </Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Place</Form.Label>
                            <Form.Control type="number" value={place} placeholder="Place" required
                                onChange={(e) => setPlace(e.target.value)} />
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

    )
}

export default AjoutPage;
