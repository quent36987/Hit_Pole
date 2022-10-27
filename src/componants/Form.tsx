import { db } from '../firebase';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { Button, Col, Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';

const Forms = (Props): JSX.Element => {
    const [validated, setValidated] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    async function add(): Promise<void> {
        const collectionRef = collection(db, 'Users');

        const docs = await addDoc(collectionRef, {
            firstName,
            lastName,
            date_inscription: Timestamp.now()
        });

        console.log(docs, Props);

        const CaldendarDocRef1 = doc(db, 'calendrier', Props.calendrierID);
        await updateDoc(CaldendarDocRef1, { users: arrayUnion(docs.id) });

        Props.cb();
    }

    async function handleSubmit(event): Promise<void> {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            await add();
        }

        setValidated(true);
    }

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Prénom"
                            autoComplete="given-name"
                            defaultValue=""
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="4" controlId="validationCustom03">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Nom"
                            autoComplete="lname"
                            defaultValue=""
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                    Ajouter
                </Button>
            </Form>
        </>
    );
};

export { Forms };
