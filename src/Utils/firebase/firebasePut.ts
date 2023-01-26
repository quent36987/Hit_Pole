import { Item, ItemConverter } from '../../data/Item';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { ELogAction, Log } from '../../data/Log';

async function addItem(item: Item, userID: string): Promise<Log> {
    const collectionRef = collection(db, 'calendrier').withConverter(ItemConverter);
    await addDoc(collectionRef, item);

    const newLog = new Log(
        Timestamp.fromDate(new Date()),
        userID,
        ELogAction.AjoutItem,
        JSON.stringify(ItemConverter.toFirestore(item))
    );

    await newLog.submit();

    return newLog;
}

export { addItem };
