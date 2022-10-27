import { AppState } from '../Context';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

const Login = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setAlert } = AppState();
    const [show, setShow] = useState(false);

    const handleClose = (): void => setShow(false);
    const handleShow = (): void => setShow(true);

    async function forgotPassword(email): Promise<void> {
        return await sendPasswordResetEmail(auth, email, {
            url: 'https://hit-pole.web.app/'
        });
    }

    async function sendNewMdp(e): Promise<void> {
        e.preventDefault();

        try {
            await forgotPassword(email);

            setAlert({
                open: true,
                message: `Un email a été envoyé à ${email}`,
                type: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
            });
        }

        handleClose();
    }

    const handleSubmit = async (): Promise<void> => {
        if (email === '' || password === '') {
            setAlert({
                open: true,
                message: 'Veuillez remplir tous les champs',
                type: 'error'
            });

            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/';

            setAlert({
                open: true,
                message: `Inscription réussie. Bonjour ${result?.user.email ?? ''}`,
                type: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
            });
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Mot de passe oublié ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>quelle est ton adresse email ?</Modal.Body>
                <input
                    style={{ margin: '15px' }}
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                    value={email}></input>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async (e) => {
                            await sendNewMdp(e);
                        }}>
                        Envoyer un nouveau mot de passe
                    </Button>
                </Modal.Footer>
            </Modal>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="email@email.fr"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="**************"
                    />
                </Form.Group>

                <p>
                    Pas encore inscrit ?<Link to="/auth/signup"> Clic ici !</Link>
                </p>
                <p>
                    mot de passe oublié ?<span onClick={handleShow}> Clic ici !</span>
                </p>
                <Button onClick={handleSubmit}>Valider</Button>
            </Form>
        </>
    );
};

export { Login };
