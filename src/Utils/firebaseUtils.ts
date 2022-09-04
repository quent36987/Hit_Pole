import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { User, UserConverter } from '../data/User';
import { db } from '../firebase';

export async function getAllUsersFirebase(): Promise<User[]> {
    const users: User[] = [];
    const collectionRef = collection(db, "Users").withConverter<User>(UserConverter);
    const data = await getDocs(collectionRef);
    data.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
    })

    return users;
}

export async function getUserFirebase(id: string): Promise<User> {
    const userRef = doc(db, "Users", id).withConverter<User>(UserConverter);
    const data = await getDoc(userRef);
    const user = data.data();
    user.id = data.id;

    return user;
}

export async function getItemFirebase(id: string): Promise<Item> {
    const itemRef = doc(db, "calendrier", id).withConverter<Item>(ItemConverter);
    const data = await getDoc(itemRef);
    const item = data.data();
    item.id = data.id;

    return item;
}

export async function getAllItemToday(): Promise<Item[]> {
    const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
    const listItem: Item[] = [];
    const datenow = new Date();
    const data = await getDocs(query(collectionRef,
        where("date", ">", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate()))),
        where("date", "<", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 1)))));

    data.forEach((doc) => {
        const exo = doc.data();
        exo.id = doc.id;
        listItem.push(exo);
    })

    return listItem;
}

export async function getAllItemMonth(date : Date) : Promise<Item[]> {
    const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
    const queryRef = query(collectionRef, orderBy("date"),
        where("date", ">", Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), -7))),
         where("date", "<", Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1, 7))));

    const data = await getDocs(queryRef);
    const listItem: Item[] = [];
    data.forEach((doc) => {
        const exo = doc.data();
        exo.id = doc.id;
        listItem.push(exo);
    })
    
    return listItem;
}