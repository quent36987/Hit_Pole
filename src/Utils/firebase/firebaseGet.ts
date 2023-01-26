import { db } from '../../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    Timestamp,
    where
} from 'firebase/firestore';
import { Item, ItemConverter } from '../../data/Item';
import { Log, LogConverter } from '../../data/Log';
import { User, UserConverter } from '../../data/User';

async function getLogsFirebase(): Promise<Log[]> {
    const logs: Log[] = [];

    const collectionRef = collection(db, 'Logs').withConverter<Log>(LogConverter);

    const queryRef = await query(collectionRef, orderBy('date', 'desc'), limit(25));

    const data = await getDocs(queryRef);

    data.forEach((doc) => {
        const log = doc.data();
        log.id = doc.id;
        logs.push(log);
    });

    return logs;
}

async function getAllUsersFirebase(): Promise<User[]> {
    const users: User[] = [];

    const collectionRef = collection(db, 'Users').withConverter<User>(UserConverter);

    const queryRef = await query(collectionRef, orderBy('firstName'));

    const data = await getDocs(queryRef);

    data.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
    });

    return users;
}

async function getUserFirebase(id: string): Promise<User> {
    const userRef = doc(db, 'Users', id).withConverter<User>(UserConverter);
    const data = await getDoc(userRef);
    const user = data.data();
    user.id = data.id;

    return user;
}

async function getItemFirebase(id: string): Promise<Item> {
    const itemRef = doc(db, 'calendrier', id).withConverter<Item>(ItemConverter);
    const data = await getDoc(itemRef);
    const item = data.data();
    item.id = data.id;

    return item;
}

async function getAllItemToday(): Promise<Item[]> {
    const collectionRef = collection(db, 'calendrier').withConverter<Item>(ItemConverter);
    const listItem: Item[] = [];
    const datenow = new Date();

    const data = await getDocs(
        query(
            collectionRef,
            where(
                'date',
                '>',
                Timestamp.fromDate(
                    new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate())
                )
            ),
            where(
                'date',
                '<',
                Timestamp.fromDate(
                    new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 1)
                )
            )
        )
    );

    data.forEach((doc) => {
        const exo = doc.data();
        exo.id = doc.id;
        listItem.push(exo);
    });

    return listItem;
}

async function getAllItemMonth(date: Date): Promise<Item[]> {
    const collectionRef = collection(db, 'calendrier').withConverter<Item>(ItemConverter);

    const queryRef = query(
        collectionRef,
        orderBy('date'),
        where('date', '>', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), -7))),
        where('date', '<', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1, 7)))
    );

    const data = await getDocs(queryRef);
    const listItem: Item[] = [];

    data.forEach((doc) => {
        const exo = doc.data();
        exo.id = doc.id;
        listItem.push(exo);
    });

    return listItem;
}

async function getAllItems(): Promise<Item[]> {
    const collectionRef = collection(db, 'calendrier').withConverter<Item>(ItemConverter);
    const queryRef = query(collectionRef, orderBy('date'));
    const data = await getDocs(queryRef);
    const items = [];

    data.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        items.push(user);
    });

    return items;
}

export {
    getAllUsersFirebase,
    getUserFirebase,
    getItemFirebase,
    getLogsFirebase,
    getAllItemToday,
    getAllItemMonth,
    getAllItems
};
