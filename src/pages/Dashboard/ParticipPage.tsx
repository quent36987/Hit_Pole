import React, { useEffect, useState } from 'react';
import '../allPage.css';
import { Modal } from 'react-bootstrap';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { RouteComponentProps } from 'react-router-dom';
import IPage from '../../interfaces/page';
import { Item } from '../../data/Item';
import { db } from '../../firebase';
import { DateFormat, getUserName } from '../../Utils/utils';
import { User } from '../../data/User';
import { AppState } from '../../Context';
import { getAllItemToday, getAllUsersFirebase, getItemFirebase } from '../../Utils/firebaseUtils';

const ParticipPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selected, setSelected] = useState(0);
    const [users, setusers] = useState<User[]>([]);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [update, setUpdate] = useState(true);
    const [userAdd, setUserAdd] = useState(null);

    const [load, setLoad] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = (): void => setShow(false);
    const handleShow = (): void => setShow(true);

    const { setAlert } = AppState();

    useEffect(() => {
        if (items.length > 0) {
            setUserSelected(items[selected].participation);
            setUpdate(!update);
        }
    }, [selected]);

    useEffect(() => {
        LoadData().catch(console.error);
    }, [props.name]);

    useEffect(() => {
        getAllUsersFirebase()
            .then((data) => {
                setusers(data);
            })
            .catch(console.error);
    }, [props]);

    async function LoadData(): Promise<void> {
        let list: Item[] = [];

        if (props.match.params.id === '0') {
            list = await getAllItemToday();
        } else {
            list.push(await getItemFirebase(props.match.params.id));
        }

        setItems(list);

        if (list.length > 0 && selected < list.length) {
            setUserSelected(list[selected].participation);
        }

        setUpdate(!update);
        setLoad(true);
    }

    const addPartcipant = async (event, id: string): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();

        if (userAdd == null || items[selected].users.includes(id)) {
            setAlert({
                open: true,
                message: 'error',
                type: 'error'
            });

            return;
        }

        const CaldendarDocRef1 = doc(db, 'calendrier', items[selected].id);
        await updateDoc(CaldendarDocRef1, { users: arrayUnion(id) });

        const usersSelect = userSelected;
        usersSelect.push(id);
        const CaldendarDocRef = doc(db, 'calendrier', items[selected].id);

        updateDoc(CaldendarDocRef, { participation: usersSelect })
            .then(() => {
                setAlert({
                    open: true,
                    message: 'Modification effectuée',
                    type: 'success'
                });
            })
            .catch(() => {
                setAlert({
                    open: true,
                    message: 'Erreur lors de la modification',
                    type: 'error'
                });
            });

        LoadData().catch(console.error);
    };

    const handleSubmit = async (event): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        console.log(userSelected);

        const CaldendarDocRef = doc(db, 'calendrier', items[selected].id);

        updateDoc(CaldendarDocRef, { participation: userSelected })
            .then(() => {
                setAlert({
                    open: true,
                    message: 'Modification effectuée',
                    type: 'success'
                });
            })
            .catch(() => {
                setAlert({
                    open: true,
                    message: 'Erreur lors de la modification',
                    type: 'error'
                });
            });
    };

    return (
        <>
            {load && items && items.length > 0 ? (
                <div>
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
                            setSelected(parseInt(e.target.value));
                            console.log(selected);
                        }}>
                        {items.map((item, index) => (
                            <option key={index} value={index}>
                                {DateFormat(item.date.toDate())}
                            </option>
                        ))}
                    </select>
                    <div>
                        <form>
                            {items[selected].users.map((item, index) => (
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
                                    {getUserName(users, item)}
                                </div>
                            ))}
                        </form>

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
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Ajouter un participant</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form>
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
                                                {item.getFullName()}
                                            </option>
                                        ))}
                                    </select>
                                </form>
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
                                </button>
                            </Modal.Body>
                        </Modal>

                        <button
                            style={{
                                height: '50px',
                                fontSize: '20px',
                                marginBottom: '20px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                backgroundColor: '#84CA40',
                                color: '#000',
                                margin: '20px',
                                width: '85vw'
                            }}
                            onClick={handleSubmit}>
                            Valider
                        </button>
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
                            {items[selected].desc}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ParticipPage;
