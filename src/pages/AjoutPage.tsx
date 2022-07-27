import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import { AppState } from '../Context';
import { Button, Form, Row } from 'react-bootstrap';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';


const AjoutPage: React.FunctionComponent<IPage> = props => {

    const {setAlert } = AppState();
    const [validated, setValidated] = useState(false);


    const [titre, setTitre] = useState("");
    const [niveau, setNiveau] = useState("");
    const [desc, setDesc] = useState("");
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
           
            const payload = {
                titre: titre,
                desc: desc,
                temps: temps,
                date: Timestamp.fromDate(new Date(date)),
                place: place,
                users : [],
                unite : 1,
            }
            try {
                const collectionRef = collection(db, "calendrier");
                await addDoc(collectionRef, payload);
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
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Titre</Form.Label>
                        <Form.Control type="text" value={titre} placeholder="Nom" required 
                        onChange={(e) => setTitre(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Niveau</Form.Label>
                        <Form.Select aria-label="" value={niveau}
                            onChange={(e) => { setNiveau(e.target.value) }}
                            required
                        >
                            <option value="">Sélectioner un niveau</option>
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>

                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Niveau.
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Description</Form.Label>
                        <Form.Control as="textarea" value={desc} placeholder="Description" required 
                        rows={2}
                        onChange={(e) => setDesc(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Date</Form.Label>
                        <Form.Control type="datetime-local" value={date} placeholder="Nom" required 
                        onChange={(e) => setDate(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Temps</Form.Label>
                        <Form.Control type="number" value={temps} placeholder="Minute" required 
                        onChange={(e) => setTemps(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="mb-3" style={{"marginRight":"1vw","marginLeft":"1vw"}}>
                        <Form.Label style={{ "fontSize": "80%", "marginBottom": "0px" }}>Place</Form.Label>
                        <Form.Control type="number" value={place} placeholder="Place" required 
                        onChange={(e) => setPlace(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Veuillez entrer un Titre.
                        </Form.Control.Feedback>
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
