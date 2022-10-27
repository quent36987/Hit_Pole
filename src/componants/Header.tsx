/* eslint-disable */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { signOut } from 'firebase/auth';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { AppState } from '../Context';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ExportCSV } from '../Utils/exportCSV';
// import "./Header.css"

const App = () => {
    const { user, setAlert, perm } = AppState();
    const [expanded, setExpanded] = useState(false);

    const logOut = () => {
        signOut(auth);

        setAlert({
            open: true,
            type: 'success',
            message: 'Logout Successfull !'
        });
    };

    return (
        <Navbar
            collapseOnSelect
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            expand="md"
            bg="light"
            variant="light"
            className="px-3 py-8"
        >
            <Link className="navbar-brand" to="/" onClick={() => setExpanded(false)}>
                HIT-POLE🤸🏼‍♀️
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-na" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto px-2">
                    {perm ? (
                        <>
                            <NavDropdown title="👑 Administration">
                                <Link
                                    onClick={() => setExpanded(false)}
                                    className="dropdown-item"
                                    to="/ajout"
                                >
                                    ➕ Ajouter
                                </Link>
                                <Link
                                    onClick={() => setExpanded(false)}
                                    className="dropdown-item"
                                    to="/duplica"
                                >
                                    ➿ Duplication
                                </Link>
                                <Link
                                    onClick={() => setExpanded(false)}
                                    className="dropdown-item"
                                    to="/dashboard"
                                >
                                    📝 Dashboard
                                </Link>
                                <Link
                                    onClick={() => setExpanded(false)}
                                    className="dropdown-item"
                                    to="/particip/0"
                                >
                                    ✔️ Check !
                                </Link>
                                <Link
                                    onClick={() => setExpanded(false)}
                                    className="dropdown-item"
                                    to="/export"
                                >
                                    📁 Export
                                </Link>
                            </NavDropdown>
                        </>
                    ) : (
                        <></>
                    )}
                    <Link onClick={() => setExpanded(false)} className="nav-link" to="/">
                        🏠 Accueil
                    </Link>
                    <Link onClick={() => setExpanded(false)} className="nav-link" to="/calendrier">
                        🗓️ Calendrier
                    </Link>
                    <Link onClick={() => setExpanded(false)} className="nav-link" to="/profile">
                        👩 Profil
                    </Link>
                    <Link onClick={() => setExpanded(false)} className="nav-link" to="/contact">
                        📞 Contact
                    </Link>
                </Nav>
                <Nav>
                    {user ? (
                        <Button
                            onClick={() => {
                                setExpanded(false);
                                logOut();
                            }}
                            variant="outline-danger"
                        >
                            Se déconnecter
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setExpanded(false)}
                            variant="outline-success"
                            href="/auth/login"
                        >
                            Se connecter
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default App;
