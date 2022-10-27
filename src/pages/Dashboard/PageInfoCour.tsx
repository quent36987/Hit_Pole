/* eslint-disable */
import React, { useEffect, useState } from 'react';
import '../allPage.css';
import { Button, Modal } from 'react-bootstrap';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { RouteComponentProps } from 'react-router-dom';
import IPage from '../../interfaces/page';
import { Item } from '../../data/Item';
import { db } from '../../firebase';
import { User } from '../../data/User';
import { AppState } from '../../Context';
import { getAllUsersFirebase, getItemFirebase } from '../../Utils/firebaseUtils';
import Forms from '../../componants/Form';
import { getUserName } from '../../Utils/utils';

const InfoCourPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const { setAlert } = AppState();
    const [items, setItems] = useState<Item>(null);
    const [users, setusers] = useState<User[]>([]);
    const [update, setUpdate] = useState(true);
    const [userAdd, setUserAdd] = useState(null);

    const [load, setLoad] = useState(false);

    const [show, setShow] = useState(false);
    const [modalNewUser, setModalNewUser] = useState(false);
    const handleClose = () => setShow(false);

    const handleShow1 = () => {
        setModalNewUser(true);
        setShow(true);
    };

    const handleShow = () => {
        setModalNewUser(false);
        setShow(true);
    };

    useEffect(() => {
        LoadData();
    }, [props.name]);

    useEffect(() => {
        getAllUsersFirebase().then((data) => {
            setusers(data);
        });
    }, [props]);

    async function LoadData() {
        const item = await getItemFirebase(props.match.params.id);
        setItems(item);
        setUpdate(!update);
        setLoad(true);
    }

    const addPartcipant = async (event, id: string) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (userAdd == null || items.users.includes(id)) {
            setAlert({
                open: true,
                message: 'error',
                type: 'error'
            });

            return;
        }

        const CaldendarDocRef1 = doc(db, 'calendrier', items.id);
        updateDoc(CaldendarDocRef1, { users: arrayUnion(id) });

        LoadData();
    };

    return (
        <>
            {load && items ? (
                <div>
                    <div style={{ marginLeft: '17px' }}>
                        Participants :
                        {items.users.map((item, index) => (
                            <>
                                {' '}
                                <div
                                    key={index}
                                    style={{
                                        height: '35px',
                                        fontSize: '25px',
                                        marginBottom: '5px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Button
                                        variant="outline-danger"
                                        style={{
                                            fontSize: '10px',
                                            marginRight: '10px',
                                            marginBottom: '5px'
                                        }}
                                        onClick={() => {
                                            // are your sure ?
                                            if (
                                                window.confirm(
                                                    'Voulez-vous vraiment supprimer cette personne ?'
                                                )
                                            ) {
                                                const CaldendarDocRef1 = doc(
                                                    db,
                                                    'calendrier',
                                                    items.id
                                                );

                                                const list = items.users.filter((e) => e !== item);

                                                updateDoc(CaldendarDocRef1, {
                                                    users: list
                                                });

                                                LoadData();
                                            }
                                        }}
                                    >
                                        🗑️
                                    </Button>
                                    {getUserName(users, item)}
                                </div>
                            </>
                        ))}
                    </div>

                    <button
                        style={{
                            height: '50px',
                            fontSize: '20px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            color: '#000',
                            width: '85vw',
                            marginRight: '20px',
                            marginLeft: '20px',
                            marginTop: '20px'
                        }}
                        onClick={handleShow}
                    >
                        Ajouter un participant
                    </button>

                    <button
                        style={{
                            fontSize: '20px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            color: '#000',
                            width: '85vw',
                            marginRight: '20px',
                            marginLeft: '20px',
                            marginTop: '10px'
                        }}
                        onClick={handleShow1}
                    >
                        Ajouter un utilisateur sans compte
                    </button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ajouter un participant</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {' '}
                            {modalNewUser ? (
                                <Forms
                                    calendrierID={items.id}
                                    cb={() => {
                                        handleClose();

                                        getAllUsersFirebase().then((data) => {
                                            setusers(data);
                                            LoadData();
                                        });
                                    }}
                                />
                            ) : (
                                <>
                                    <select
                                        style={{
                                            height: '50px',
                                            fontSize: '20px',
                                            marginBottom: '20px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            margin: '20px',
                                            width: '85vw'
                                        }}
                                        onChange={(e) => {
                                            setUserAdd(e.target.value);
                                        }}
                                    >
                                        {users.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.getFullName()}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        style={{
                                            height: '50px',
                                            fontSize: '20px',
                                            marginBottom: '20px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            color: '#000',
                                            width: '85vw',
                                            marginRight: '20px',
                                            marginLeft: '20px',
                                            marginTop: '20px'
                                        }}
                                        onClick={(e) => {
                                            addPartcipant(e, userAdd);
                                            handleClose();
                                        }}
                                    >
                                        Ajouter
                                    </button>{' '}
                                </>
                            )}
                        </Modal.Body>
                    </Modal>

                    <div style={{ fontSize: '20px', textAlign: 'center' }}>commentaire :</div>
                    <div
                        style={{
                            height: '200px',
                            fontSize: '20px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            color: '#000',
                            marginLeft: '20px',
                            marginRight: '20px',
                            padding: '4px'
                        }}
                    >
                        {items.desc}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default InfoCourPage;
