import { db } from '../../firebase';
import { getAllUsersFirebase } from '../../Utils/firebaseUtils';
import { IPage } from '../../interfaces/page';
import { useHistory } from 'react-router-dom';
import { User } from '../../data/User';
import { UserForm } from '../../componants/UserForm';
import { Button, OverlayTrigger, Popover, Tab, Table, Tabs } from 'react-bootstrap';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    where
} from 'firebase/firestore';
import { dateTimeAbv, getUserName } from '../../Utils/utils';
import { Item, ItemConverter } from '../../data/Item';
import React, { useEffect, useState } from 'react';

const DashPage: React.FunctionComponent<IPage> = (props) => {
    const [data, setData] = useState<Item[]>([]);
    const [dataBis, setDataBis] = useState<Item[]>([]);
    const [key, setKey] = useState('users');
    const [users, setusers] = useState<User[]>([]);
    const [last, setlast] = useState(null);
    const [lastBis, setlastBis] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getAllUser().catch(console.error);

        voirPlus().catch(console.error);
        voirPlusBis().catch(console.error);
    }, [props]);

    async function getAllUser(): Promise<void> {
        getAllUsersFirebase()
            .then((data) => {
                setusers(data);
            })
            .catch(console.error);
    }

    async function voirPlus(): Promise<void> {
        const limi = 10;

        if (last) {
            const next = query(
                collection(db, 'calendrier').withConverter<Item>(ItemConverter),
                orderBy('date'),
                where('date', '>', Timestamp.fromDate(new Date())),
                startAfter(last),
                limit(limi)
            );

            await getDocs(next).then((snapshot) => {
                const list = data;

                if (snapshot.size === 0) {
                    setlast(null);

                    return;
                }

                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });

                setData(list);

                if (list.length > 0) {
                    setlast(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlast(null);
                }
            });
        } else {
            const next = query(
                collection(db, 'calendrier').withConverter<Item>(ItemConverter),
                orderBy('date'),
                where('date', '>', Timestamp.fromDate(new Date())),
                limit(limi)
            );

            await getDocs(next).then((snapshot) => {
                const list: Item[] = [];

                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });

                setData(list);

                if (list.length > 0) {
                    setlast(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlast(null);
                }
            });
        }
    }

    async function voirPlusBis(): Promise<void> {
        const limi = 10;

        if (lastBis) {
            const next = query(
                collection(db, 'calendrier').withConverter<Item>(ItemConverter),
                orderBy('date', 'desc'),
                where('date', '<=', Timestamp.fromDate(new Date())),
                startAfter(lastBis),
                limit(limi)
            );

            await getDocs(next).then((snapshot) => {
                const list = dataBis;

                if (snapshot.size === 0) {
                    setlastBis(null);

                    return;
                }

                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });

                setDataBis(list);

                if (list.length > 0) {
                    setlastBis(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlastBis(null);
                }
            });
        } else {
            const next = query(
                collection(db, 'calendrier').withConverter<Item>(ItemConverter),
                orderBy('date', 'desc'),
                where('date', '<=', Timestamp.fromDate(new Date())),
                limit(limi)
            );

            await getDocs(next).then((snapshot) => {
                const list: Item[] = [];

                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });

                setDataBis(list);

                if (list.length > 0) {
                    setlastBis(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlastBis(null);
                }
            });
        }
    }

    const popover = (list): JSX.Element => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Inscrits :</Popover.Header>
            <Popover.Body>
                {list.map((user, index) => (
                    <div key={index}>
                        <div>{user}</div>
                    </div>
                ))}
            </Popover.Body>
        </Popover>
    );

    const PopoverUser = (user: User): JSX.Element => (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Modification {user.getFullName}</Popover.Header>
            <Popover.Body>
                <UserForm user={user} cb={getAllUser} />
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3">
                <Tab eventKey="users" title="Utilisateurs">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Prenom</th>
                                <th>Nom</th>
                                <th>Tel</th>
                                <th>Commentaire</th>
                                <th>Modifier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.prenom}</td>
                                    <td>{user.nom}</td>
                                    <td>{user.tel}</td>
                                    <td>{user.commentaire} </td>
                                    <td>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement="left"
                                            overlay={PopoverUser(user)}>
                                            <Button variant="success-outline"> ✏️</Button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="cours" title="Cours">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Date</th>
                                <th>Nombre inscription</th>
                                <th>Temps</th>
                                <th>Commentaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.titre} - {item.niveau}
                                    </td>
                                    <td>{dateTimeAbv(item.date.toDate())}</td>
                                    <td>
                                        {item.users.length} / {item.place}
                                    </td>
                                    <td>{item.temps}</td>
                                    <td>{item.desc}</td>
                                    <td>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement="left"
                                            overlay={popover(
                                                item.users.map((u) => getUserName(users, u))
                                            )}>
                                            <Button variant="success-outline">❔</Button>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-warning"
                                            onClick={() => {
                                                history.push(`/modif/${item.id}`);
                                            }}>
                                            ✏️
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-success"
                                            onClick={() => {
                                                history.push(`/particip/${item.id}`);
                                            }}>
                                            ✔️
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-info"
                                            onClick={() => {
                                                history.push(`/coursinfo/${item.id}`);
                                            }}>
                                            🧑‍🤝‍🧑
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                deleteDoc(doc(db, 'calendrier', item.id))
                                                    .then(() => {
                                                        const list = data;
                                                        list.splice(list.indexOf(item), 1);
                                                        setData(list);

                                                        if (list.length === 0) {
                                                            setlast(null);
                                                        }

                                                        setIsUpdate(!isUpdate);
                                                    })
                                                    .catch(console.error);
                                            }}>
                                            🗑️
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {last !== null ? (
                        <div style={{ textAlign: 'center' }} onClick={async () => await voirPlus()}>
                            voir plus..
                        </div>
                    ) : null}
                </Tab>

                <Tab eventKey="cours passe" title="Cours passé">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Date</th>
                                <th>Nombre inscription</th>
                                <th>Temps</th>
                                <th>Commentaire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataBis.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.titre} - {item.niveau}
                                    </td>
                                    <td>{dateTimeAbv(item.date.toDate())}</td>
                                    <td>
                                        {item.users.length} / {item.place}
                                    </td>
                                    <td>{item.temps}</td>
                                    <td>{item.desc}</td>
                                    <td>
                                        <OverlayTrigger
                                            trigger="click"
                                            placement="left"
                                            overlay={popover(
                                                item.users.map((u) =>
                                                    users.find((user) => user.id === u)
                                                )
                                            )}>
                                            <Button variant="success-outline">❔</Button>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        <Button
                                            variant="success-outline"
                                            onClick={() => {
                                                history.push(`/modif/${item.id}`);
                                            }}>
                                            ✏️
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-success"
                                            onClick={() => {
                                                history.push(`/particip/${item.id}`);
                                            }}>
                                            ✔️
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-info"
                                            onClick={() => {
                                                history.push(`/coursinfo/${item.id}`);
                                            }}>
                                            🧑‍🤝‍🧑
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            onClick={() => {
                                                deleteDoc(doc(db, 'calendrier', item.id))
                                                    .then(() => {
                                                        const list = dataBis;
                                                        list.splice(list.indexOf(item), 1);
                                                        setDataBis(list);

                                                        if (list.length === 0) {
                                                            setlastBis(null);
                                                        }

                                                        setIsUpdate(!isUpdate);
                                                    })
                                                    .catch(console.error);
                                            }}>
                                            🗑️
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {lastBis !== null ? (
                        <div
                            style={{ textAlign: 'center' }}
                            onClick={async () => await voirPlusBis()}>
                            voir plus..
                        </div>
                    ) : null}
                </Tab>
            </Tabs>
        </>
    );
};

export { DashPage };
