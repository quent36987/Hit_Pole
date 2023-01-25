import '../allPage.css';
import { AppState } from '../../Context';
import { db } from '../../firebase';
import { Forms } from '../../componants/Form';
import { getUserName } from '../../Utils/utils';
import { IPage } from '../../interfaces/page';
import { Item } from '../../data/Item';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '../../data/User';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Button, Modal } from 'react-bootstrap';
import { getAllUsersFirebase, getItemFirebase } from '../../Utils/firebase/firebaseGet';
import React, { useEffect, useState } from 'react';

const InfoCourPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const { setAlert } = AppState();
    const [items, setItems] = useState<Item>(null);
    const [users, setusers] = useState<User[]>([]);
    const [isUpdate, setIsUpdate] = useState(true);
    const [userAdd, setUserAdd] = useState(null);

    const [isLoad, setIsLoad] = useState(false);

    const [isShow, setIsShow] = useState(false);
    const [isModalNewUser, setIsModalNewUser] = useState(false);
    const handleClose = (): void => setIsShow(false);

    const handleShow1 = (): void => {
        setIsModalNewUser(true);
        setIsShow(true);
    };

    const handleShow = (): void => {
        setIsModalNewUser(false);
        setIsShow(true);
    };

    useEffect(() => {
        loadData().catch(console.error);
    }, [props.name]);

    useEffect(() => {
        void getAllUsersFirebase().then((data) => {
            setusers(data);
        });
    }, [props]);

    async function loadData(): Promise<void> {
        const item = await getItemFirebase(props.match.params.id);
        setItems(item);
        setIsUpdate(!isUpdate);
        setIsLoad(true);
    }

    const addPartcipant = async (event, id: string): Promise<void> => {
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

        const caldendarDocRef1 = doc(db, 'calendrier', items.id);

        await updateDoc(caldendarDocRef1, {
            users: arrayUnion(id)
        });

        await loadData();
    };

    async function deleteParticipant(item: string): Promise<void> {
        if (window.confirm('Voulez-vous vraiment supprimer cette personne ?')) {
            const caldendarDocRef1 = doc(db, 'calendrier', items.id);

            const list = items.users.filter((e) => e !== item);

            await updateDoc(caldendarDocRef1, {
                users: list
            });

            await loadData();
        }
    }

    return (
        <>
            {isLoad && items ? (
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
                                    }}>
                                    <Button
                                        variant="outline-danger"
                                        style={{
                                            fontSize: '10px',
                                            marginRight: '10px',
                                            marginBottom: '5px'
                                        }}
                                        onClick={async () => await deleteParticipant(item)}>
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
                        onClick={handleShow}>
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
                        onClick={handleShow1}>
                        Ajouter un utilisateur sans compte
                    </button>

                    <Modal show={isShow} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ajouter un participant</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {' '}
                            {isModalNewUser ? (
                                <Forms
                                    calendrierID={items.id}
                                    cb={() => {
                                        handleClose();

                                        getAllUsersFirebase()
                                            .then((data) => {
                                                setusers(data);
                                                loadData().catch(console.error);
                                            })
                                            .catch(console.error);
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
                                        }}>
                                        {users.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.getFullName}
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
                                            addPartcipant(e, userAdd).catch(console.error);
                                            handleClose();
                                        }}>
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
                        }}>
                        {items.desc}
                    </div>
                </div>
            ) : null}
        </>
    );
};

export { InfoCourPage };
