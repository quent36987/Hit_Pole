import { db } from '../firebase';
import PropTypes from 'prop-types';
import { addDoc, arrayUnion, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { Button, Col, Form, Row } from 'react-bootstrap';
import React, { useState } from 'react';

const Forms = (props): JSX.Element => {
    const [isValidated, setIsValidated] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    async function add(): Promise<void> {
        const collectionRef = collection(db, 'Users');

        const docs = await addDoc(collectionRef, {
            firstName,
            lastName,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            date_inscription: Timestamp.now()
        });

        const CaldendarDocRef1 = doc(db, 'calendrier', props.calendrierID);
        await updateDoc(CaldendarDocRef1, { users: arrayUnion(docs.id) });

        props.cb();
    }

    async function handleSubmit(event): Promise<void> {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            await add();
        }

        setIsValidated(true);
    }

    return (
        <>
            <Form noValidate validated={isValidated} onSubmit={handleSubmit}>
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

Forms.propTypes = {
    calendrierID: PropTypes.string.isRequired,
    cb: PropTypes.func
};

export { Forms };
