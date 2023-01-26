import { AppState } from '../Context';
import { Item } from '../data/Item';
import { Timestamp } from 'firebase/firestore';
import { annuler, reserver } from '../Utils/utils';
import { Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useToast } from '../toast';

interface IReserverProps {
    item: Item;
    userId: string;
    cb: () => void;
}

/** item.date passé => ce court est passé
    item.users.include me or famille => annuler la reservation
    item.users.lenght = place => ce court est complet
    sinon => reserver (attention pour les familles au niveau des places) */
const ReserverButton = (props: IReserverProps): JSX.Element => {
    const [isShow, setIsShow] = useState(false);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [isUpdate, setIsUpdate] = useState(true);

    const toast = useToast();
    const { profil, user } = AppState();

    const handleClose = (): void => setIsShow(false);
    const handleShow = (): void => setIsShow(true);

    const onFamilleClick = async (): Promise<void> => {
        if (userSelected.length > props.item.place - props.item.users.length) {
            toast.openError('Pas assez de place');

            return;
        }

        if (userSelected.includes('moi')) {
            await reserver(props.item, props.userId, toast);
        }

        const famille = userSelected.filter((value) => value !== 'moi');

        for (let i = 0; i < famille.length; i++) {
            await reserver(props.item, `F_${user.uid}_${famille[i]}`, toast);
        }

        handleClose();
        props.cb();
    };

    const onReservation = async (): Promise<void> => {
        if (!user) {
            toast.openError('Vous devez être connecté pour réserver');

            return;
        }

        if (profil.famille.length > 0) {
            handleShow();
        } else {
            await reserver(props.item, props.userId, toast);
            props.cb();
        }
    };

    const onAnnulation = async (): Promise<void> => {
        if (window.confirm('Voulez-vous vraiment annuler ce cours ?')) {
            if (profil.famille.length > 0) {
                for (let i = 0; i < props.item.users.length; i++) {
                    if (props.item.users[i].startsWith(`F_${user.uid}`)) {
                        await annuler(props.item, props.item.users[i], toast);
                    }
                }

                if (props.item.users.includes(props.userId)) {
                    await annuler(props.item, props.userId, toast);
                }
            } else {
                await annuler(props.item, props.userId, toast);
            }

            props.cb();
        }
    };

    function hasFamille(): boolean {
        for (let i = 0; i < props.item.users.length; i++) {
            if (props.item.users[i].startsWith(`F_${user?.uid}`)) {
                return true;
            }
        }

        return false;
    }

    const button = (): JSX.Element => {
        if (props.item.date < Timestamp.fromDate(new Date())) {
            return <div style={{ marginRight: '10px', fontSize: '12px' }}>Ce cours est passé.</div>;
        }

        if (props.item.users.includes(props.userId) || hasFamille()) {
            return (
                <Button
                    variant="outline-danger"
                    style={{ marginRight: '10px', fontSize: '12px' }}
                    onClick={onAnnulation}>
                    Annuler la réservation
                </Button>
            );
        }

        if (props.item.users.length >= props.item.place) {
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
            <Modal show={isShow} onHide={handleClose}>
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
                                        setIsUpdate(!isUpdate);
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

export { ReserverButton };
