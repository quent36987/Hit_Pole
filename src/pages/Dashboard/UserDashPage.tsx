import { AppState } from '../../Context';
import { db } from '../../firebase';
import { getAllUsersFirebase } from '../../Utils/firebaseUtils';
import { IPage } from '../../interfaces/page';
import { TabCours } from './TabCours';
import { TabUsers } from './TabUsers';
import { User } from '../../data/User';
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
import { ELogAction, Log } from '../../data/Log';
import { Item, ItemConverter } from '../../data/Item';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

const DashPage: React.FunctionComponent<IPage> = (props) => {
    const [data, setData] = useState<Item[]>([]);
    const [dataBis, setDataBis] = useState<Item[]>([]);
    const [key, setKey] = useState('users');
    const [users, setusers] = useState<User[]>([]);
    const [last, setlast] = useState(null);
    const [lastBis, setlastBis] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const { user } = AppState();

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

    async function deleteItem(item: Item): Promise<void> {
        deleteDoc(doc(db, 'calendrier', item.id))
            .then(() => {
                new Log(
                    Timestamp.fromDate(new Date()),
                    user.uid,
                    ELogAction.AjoutItem,
                    JSON.stringify(ItemConverter.toFirestore(item))
                )
                    .submit()
                    .catch(console.error);

                const list = data;
                list.splice(list.indexOf(item), 1);
                setData(list);

                if (list.length === 0) {
                    setlast(null);
                }

                const list2 = dataBis;
                list2.splice(list2.indexOf(item), 1);
                setDataBis(list2);

                if (list2.length === 0) {
                    setlastBis(null);
                }

                setIsUpdate(!isUpdate);

                console.log('item DELETE');
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

    return (
        <>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3">
                <Tab eventKey="users" title="Utilisateurs">
                    <TabUsers users={users} getAllUser={getAllUser} />
                </Tab>

                <Tab eventKey="cours" title="Cours">
                    <TabCours users={users} data={data} deleteItem={deleteItem} />

                    {last !== null ? (
                        <div style={{ textAlign: 'center' }} onClick={async () => await voirPlus()}>
                            voir plus..
                        </div>
                    ) : null}
                </Tab>

                <Tab eventKey="cours passe" title="Cours passé">
                    <TabCours users={users} data={dataBis} deleteItem={deleteItem} />

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
