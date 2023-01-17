import { ELogAction, Log } from '../data/Log';
import { getItem, ItemConverter } from '../data/Item';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

async function restoreLog(log: Log, userId: string): Promise<Log> {
    const item = getItem(JSON.parse(log.data));

    const collectionRef = collection(db, 'calendrier').withConverter(ItemConverter);
    await addDoc(collectionRef, item).catch(console.error);

    const newLog = new Log(
        Timestamp.fromDate(new Date()),
        userId,
        ELogAction.AjoutItem,
        JSON.stringify(ItemConverter.toFirestore(item))
    );

    await newLog.submit();

    return newLog;
}

export { restoreLog };
