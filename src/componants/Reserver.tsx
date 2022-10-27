import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AppState } from '../Context';
import { Item } from '../data/Item';
import { Annuler, Reserver } from '../Utils/utils';

interface IReserverProps {
    item: Item;
    userId: string;
    cb: () => void;
}

/** item.date passé => ce court est passé
    item.users.include me or famille => annuler la reservation
    item.users.lenght = place => ce court est complet
    sinon => reserver (attention pour les familles au niveau des places) */
const ReserverButton = (Props: IReserverProps): JSX.Element => {
    const [show, setShow] = useState(false);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [update, setUpdate] = useState(true);

    const { profil, user, setAlert } = AppState();

    const handleClose = (): void => setShow(false);
    const handleShow = (): void => setShow(true);

    const onFamilleClick = async (): Promise<void> => {
        if (userSelected.length > Props.item.place - Props.item.users.length) {
            setAlert({
                open: true,
                type: 'error',
                message: 'Pas assez de place'
            });

            return;
        }

        if (userSelected.includes('moi')) {
            await Reserver(Props.item, setAlert, Props.userId);
        }

        const famille = userSelected.filter((value) => value !== 'moi');

        for (let i = 0; i < famille.length; i++) {
            await Reserver(Props.item, setAlert, `F_${user.uid}_${famille[i]}`);
        }

        handleClose();
        Props.cb();
    };

    const onReservation = async (): Promise<void> => {
        if (!user) {
            setAlert({
                open: true,
                type: 'error',
                message: 'Vous devez être connecté pour réserver'
            });

            return;
        }

        if (profil.famille.length > 0) {
            handleShow();
        } else {
            await Reserver(Props.item, setAlert, Props.userId);
            Props.cb();
        }
    };

    const onAnnulation = async (): Promise<void> => {
        if (window.confirm('Voulez-vous vraiment annuler ce cours ?')) {
            if (profil.famille.length > 0) {
                for (let i = 0; i < Props.item.users.length; i++) {
                    if (Props.item.users[i].startsWith(`F_${user.uid}`)) {
                        await Annuler(Props.item, setAlert, Props.item.users[i]);
                    }
                }

                if (Props.item.users.includes(Props.userId)) {
                    await Annuler(Props.item, setAlert, Props.userId);
                }
            } else {
                await Annuler(Props.item, setAlert, Props.userId);
            }

            Props.cb();
        }
    };

    function hasFamille(): boolean {
        for (let i = 0; i < Props.item.users.length; i++) {
            if (Props.item.users[i].startsWith(`F_${user?.uid}`)) {
                return true;
            }
        }

        return false;
    }

    const button = (): JSX.Element => {
        if (Props.item.date < Timestamp.fromDate(new Date())) {
            return <div style={{ marginRight: '10px', fontSize: '12px' }}>Ce cours est passé.</div>;
        }

        if (Props.item.users.includes(Props.userId) || hasFamille()) {
            return (
                <Button
                    variant="outline-danger"
                    style={{ marginRight: '10px', fontSize: '12px' }}
                    onClick={onAnnulation}>
                    Annuler la réservation
                </Button>
            );
        }

        if (Props.item.users.length >= Props.item.place) {
            return <div style={{ marginRight: '10px', fontSize: '13px' }}>Complet</div>;
        }

        return (
            <Button
                variant="outline-success"
                style={{ marginRight: '10px' }}
                onClick={onReservation}>
                Réserver
            </Button>
        );
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Votre famille</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {profil &&
                        ['moi', ...profil.famille].map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    height: '35px',
                                    fontSize: '25px',
                                    marginBottom: '5px',
                                    overflow: 'hidden'
                                }}>
                                <input
                                    type="checkbox"
                                    style={{
                                        marginRight: '10px',
                                        marginLeft: '10px',
                                        width: '20px',
                                        height: '20px'
                                    }}
                                    onChange={(e) => {
                                        let list = userSelected;

                                        if (e.target.checked) {
                                            list.push(item);
                                        } else {
                                            list = list.filter((i) => i !== item);
                                        }

                                        setUserSelected(list);
                                        setUpdate(!update);
                                    }}
                                    checked={userSelected.includes(item)}></input>
                                {item}
                            </div>
                        ))}

                    <button
                        style={{
                            height: '50px',
                            fontSize: '20px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            color: '#000',
                            marginRight: '20px',
                            marginLeft: '20px',
                            marginTop: '20px'
                        }}
                        onClick={onFamilleClick}>
                        Réserver
                    </button>
                </Modal.Body>
            </Modal>
            {button()}
        </>
    );
};

export default ReserverButton;