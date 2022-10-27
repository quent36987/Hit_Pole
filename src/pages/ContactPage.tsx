import React, { useState } from 'react';
import IPage from '../interfaces/page';
import { FormGroup } from '@material-ui/core';
import { Button, Form } from 'react-bootstrap';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState } from '../Context';

const ContactPage: React.FunctionComponent<IPage> = (props) => {
    const [message, Setmessage] = useState('');
    const [isSend, SetisSend] = useState(false);
    const { user, setAlert } = AppState();

    const handleSubmit = async (event): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        console.log(message);

        const payload = {
            user: user ? user.uid : 'anonyme',
            message,
            date: Timestamp.now()
        };

        try {
            const collectionRef = collection(db, 'contact');
            await addDoc(collectionRef, payload);
            Setmessage('');
            SetisSend(true);
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
            });
        }
    };

    return (
        <div>
            <h1 className="Titre" style={{ textAlign: 'center' }}>
                Contact
            </h1>

            <div style={{ textAlign: 'center' }}>
                <div>Hit Forme</div>
                <div>5 rue Albert Thomas</div>
                <div>42300 Roanne</div>
                <div>04 77 72 94 21</div>
                <div>hitform@gmail.com</div>
            </div>

            <div className="mt-4" style={{ textAlign: 'center' }}>
                {isSend ? (
                    <div>Merci pour votre retour</div>
                ) : (
                    <Form onSubmit={handleSubmit} className="m-3">
                        <FormGroup className="m-1">
                            <Form.Label>
                                Signaler un problème ou une amélioration ? {"(pour l'application)"}
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="message.."
                                required
                                value={message}
                                rows={4}
                                onChange={(e) => Setmessage(e.target.value)}
                            />
                            <Form.Text>
                                Le message sera envoyé et traité dans les jours suivant.
                            </Form.Text>
                        </FormGroup>
                        <Button type="submit" variant="outline-success">
                            ENVOYER
                        </Button>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default ContactPage;
