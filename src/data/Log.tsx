import { dateCompletAbv } from '../Utils/utils';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

enum ELogAction {
    AjoutItem = 'ajoutItem',
    DuplicationItem = 'duplicationItem',
    Unknow = 'unknow'
}

class Log {
    public date: Timestamp;
    public user: string;
    public action: ELogAction;
    public data: string;

    constructor(date: Timestamp, user: string, action: ELogAction, data: string) {
        this.date = date;
        this.user = user || 'unknow';
        this.action = action || ELogAction.Unknow;
        this.data = data || 'none';
    }

    public printLog(): void {
        console.log(
            `[LOG][${dateCompletAbv(this.date.toDate())}][${this.action}]`,
            `users: ${this.user}`,
            `data: ${this.data}`
        );
    }

    public async submit(): Promise<void> {
        const collectionRef = collection(db, 'Logs').withConverter(LogConverter);
        await addDoc(collectionRef, this);
        this.printLog();
    }
}

const LogConverter = {
    toFirestore: function (log: Log) {
        return {
            date: log.date,
            user: log.user,
            action: log.action,
            data: log.data
        };
    },
    fromFirestore: function (snapshot, options) {
        const log = snapshot.data(options);

        return new Log(log.date, log.user, log.action, log.data);
    }
};

export { Log, LogConverter, ELogAction };
