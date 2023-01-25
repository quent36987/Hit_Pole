import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '../toast';

const Login = (): JSX.Element => {
    const toast = useToast();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isShow, setIsShow] = useState(false);

    const handleClose = (): void => setIsShow(false);
    const handleShow = (): void => setIsShow(true);

    async function forgotPassword(email): Promise<void> {
        return await sendPasswordResetEmail(auth, email, {
            url: 'https://hit-pole.web.app/'
        });
    }

    async function sendNewMdp(e): Promise<void> {
        e.preventDefault();

        try {
            await forgotPassword(email);

            toast.openSuccess(`Un email a été envoyé à ${email}`);
        } catch (error) {
            toast.openError('error');
        }

        handleClose();
    }

    const handleSubmit = async (): Promise<void> => {
        if (email === '' || password === '') {
            toast.openError('Veuillez remplir tous les champs');

            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/';

            toast.openSuccess(`Inscription réussie. Bonjour ${result?.user.email ?? ''}`);
        } catch (error) {
            toast.openError('error');
        }
    };

    return (
        <>
            <Modal show={isShow} onHide={handleClose}>
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
                    value={email}
                />
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
