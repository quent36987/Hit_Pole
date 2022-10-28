import '../allPage.css';
import { AppState } from '../../Context';
import { db } from '../../firebase';
import { IPage } from '../../interfaces/page';
import { Item } from '../../data/Item';
import { Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '../../data/User';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { dateFormat, getUserName } from '../../Utils/utils';
import { getAllItemToday, getAllUsersFirebase, getItemFirebase } from '../../Utils/firebaseUtils';
import React, { useEffect, useState } from 'react';

const ParticipPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (props) => {
    const [items, setItems] = useState<Item[]>([]);
    const [selected, setSelected] = useState(0);
    const [users, setusers] = useState<User[]>([]);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [isUpdate, setIsUpdate] = useState(true);
    const [userAdd, setUserAdd] = useState(null);

    const [isLoad, setIsLoad] = useState(false);

    const [isShow, setIsShow] = useState(false);
    const handleClose = (): void => setIsShow(false);
    const handleShow = (): void => setIsShow(true);

    const { setAlert } = AppState();

    useEffect(() => {
        if (items.length > 0) {
            setUserSelected(items[selected].participation);
            setIsUpdate(!isUpdate);
        }
    }, [selected]);

    useEffect(() => {
        loadData().catch(console.error);
    }, [props.name]);

    useEffect(() => {
        getAllUsersFirebase()
            .then((data) => {
                setusers(data);
            })
            .catch(console.error);
    }, [props]);

    async function loadData(): Promise<void> {
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

        setIsUpdate(!isUpdate);
        setIsLoad(true);
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

        const caldendarDocRef1 = doc(db, 'calendrier', items[selected].id);
        await updateDoc(caldendarDocRef1, { users: arrayUnion(id) });

        const usersSelect = userSelected;
        usersSelect.push(id);
        const caldendarDocRef = doc(db, 'calendrier', items[selected].id);

        updateDoc(caldendarDocRef, { participation: usersSelect })
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

        loadData().catch(console.error);
    };

    const handleSubmit = async (event): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();
        console.log(userSelected);

        const caldendarDocRef = doc(db, 'calendrier', items[selected].id);

        updateDoc(caldendarDocRef, { participation: userSelected })
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
            {isLoad && items && items.length > 0 ? (
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
                                {dateFormat(item.date.toDate())}
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
                                            setIsUpdate(!isUpdate);
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
                        <Modal show={isShow} onHide={handleClose}>
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

export { ParticipPage };
