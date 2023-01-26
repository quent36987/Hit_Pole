import { AppState } from '../Context';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import React, { useState } from 'react';
import { useToast } from '../toast';

const HeaderBar = (): JSX.Element => {
    const { user, hasPerm } = AppState();
    const toast = useToast();
    const [isExpanded, setIsExpanded] = useState(false);

    const logOut = (): void => {
        void signOut(auth);

        toast.openSuccess('Déconnexion réussie !');
    };

    return (
        <Navbar
            collapseOnSelect
            expanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            expand="md"
            bg="light"
            variant="light"
            className="px-3 py-8">
            <Link className="navbar-brand" to="/" onClick={() => setIsExpanded(false)}>
                HIT-POLE🤸🏼‍♀️
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-na" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto px-2">
                    {hasPerm ? (
                        <>
                            <NavDropdown title="👑 Administration">
                                <Link
                                    onClick={() => setIsExpanded(false)}
                                    className="dropdown-item"
                                    to="/ajout">
                                    ➕ Ajouter
                                </Link>
                                <Link
                                    onClick={() => setIsExpanded(false)}
                                    className="dropdown-item"
                                    to="/duplica">
                                    ➿ Duplication
                                </Link>
                                <Link
                                    onClick={() => setIsExpanded(false)}
                                    className="dropdown-item"
                                    to="/dashboard">
                                    📝 Dashboard
                                </Link>
                                <Link
                                    onClick={() => setIsExpanded(false)}
                                    className="dropdown-item"
                                    to="/particip/0">
                                    ✔️ Check !
                                </Link>
                                <Link
                                    onClick={() => setIsExpanded(false)}
                                    className="dropdown-item"
                                    to="/logs">
                                    🕵️ Historique
                                </Link>
                            </NavDropdown>
                        </>
                    ) : (
                        <></>
                    )}
                    <Link onClick={() => setIsExpanded(false)} className="nav-link" to="/">
                        🏠 Accueil
                    </Link>
                    <Link
                        onClick={() => setIsExpanded(false)}
                        className="nav-link"
                        to="/calendrier">
                        🗓️ Calendrier
                    </Link>
                    <Link onClick={() => setIsExpanded(false)} className="nav-link" to="/profile">
                        👩 Profil
                    </Link>
                    <Link onClick={() => setIsExpanded(false)} className="nav-link" to="/contact">
                        📞 Contact
                    </Link>
                </Nav>
                <Nav>
                    {user ? (
                        <Button
                            onClick={() => {
                                setIsExpanded(false);
                                logOut();
                            }}
                            variant="outline-danger">
                            Se déconnecter
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setIsExpanded(false)}
                            variant="outline-success"
                            href="/auth/login">
                            Se connecter
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export { HeaderBar };
