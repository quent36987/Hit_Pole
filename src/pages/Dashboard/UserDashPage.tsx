import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Popover, Tab, Table, Tabs } from 'react-bootstrap';
import { AppState } from '../../Context';
import { Item, ItemConverter } from '../../data/Item';
import { User } from '../../data/User';
import { db } from '../../firebase';
import IPage from '../../interfaces/page';
import { useHistory } from 'react-router-dom';
import { getAllUsersFirebase } from '../../Utils/firebaseUtils';
import { DateTimeAbv, getUserName } from '../../Utils/utils';

const DashPage: React.FunctionComponent<IPage> = (props) => {
    const [data, setData] = useState<Item[]>([]);
    const [dataBis, setDataBis] = useState<Item[]>([]);
    const [key, setKey] = useState('users');
    const { setAlert } = AppState();
    const [users, setusers] = useState<User[]>([]);
    const [last, setlast] = useState(null);
    const [lastBis, setlastBis] = useState(null);
    const [update, setUpdate] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getAllUsersFirebase()
            .then((data) => {
                setusers(data);
            })
            .catch(console.error);

        VoirPlus().catch(console.error);
        VoirPlusBis().catch(console.error);
    }, [props]);

    async function VoirPlus(): Promise<void> {
        const limi = 10;

        if (last) {
            console.log('last', last);

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
                console.log('pub', data);

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
                console.log('pub', data);

                if (list.length > 0) {
                    setlast(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlast(null);
                }
            });
        }
    }

    async function VoirPlusBis(): Promise<void> {
        const limi = 10;

        if (lastBis) {
            console.log('last', lastBis);

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
                console.log('pub', list);

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
                console.log('pub', list);

                if (list.length > 0) {
                    setlastBis(list[list.length - 1].date);
                }

                if (snapshot.size < limi) {
                    setlastBis(null);
                }
            });
        }
    }

    async function AddSolde(user: User, solde: number): Promise<void> {
        try {
            const UserDocRef = doc(db, 'Users', user.id);
            await updateDoc(UserDocRef, { solde: increment(solde) });
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
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
                                <th>Solde</th>
                                <th>Modifier le solde</th>
                                <th>Tel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.prenom}</td>
                                    <td>{user.nom}</td>
                                    <td>{user.solde}</td>
                                    <td>
                                        <Button
                                            onClick={async () => await AddSolde(user, 1)}
                                            variant="success-outline">
                                            ➕
                                        </Button>
                                        <Button
                                            onClick={async () => await AddSolde(user, -1)}
                                            variant="success-outline">
                                            ➖
                                        </Button>
                                        <Button disabled variant="success-outline">
                                            ✏️
                                        </Button>
                                    </td>
                                    <td>{user.tel}</td>
                                    <td>
                                        <Button variant="success-outline">❔</Button>
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
                                    <td>{DateTimeAbv(item.date.toDate())}</td>
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

                                                        setUpdate(!update);
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
                        <div style={{ textAlign: 'center' }} onClick={async () => await VoirPlus()}>
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
                                    <td>{DateTimeAbv(item.date.toDate())}</td>
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

                                                        setUpdate(!update);
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
                            onClick={async () => await VoirPlusBis()}>
                            voir plus..
                        </div>
                    ) : null}
                </Tab>
            </Tabs>
        </>
    );
};

export default DashPage;
