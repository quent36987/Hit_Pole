import { AppState } from '../Context';
import { db } from '../firebase';
import PropTypes from 'prop-types';
import { User } from '../data/User';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';

const UserForm = (props): JSX.Element => {
    const [isValidated, setIsValidated] = useState(false);
    const [commentaire, setCommentaire] = useState(props.user.commentaire);

    const { setAlert } = AppState();

    async function add(): Promise<void> {
        const CaldendarDocRef = doc(db, 'Users', props.user.id);

        try {
            await updateDoc(CaldendarDocRef, { commentaire });

            setAlert({
                open: true,
                type: 'success',
                message: 'Enregistrer'
            });

            props.cb();
        } catch (error) {
            console.log(error);
        }
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
                    <Form.Group as={Col} controlId="validationCustom01">
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Commemtaire"
                            as="textarea"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit">
                    Enregistrer
                </Button>
            </Form>
        </>
    );
};

UserForm.propTypes = {
    user: PropTypes.instanceOf(User).isRequired,
    cb: PropTypes.func
};

export { UserForm };
