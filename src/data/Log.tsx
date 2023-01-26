import { db } from '../firebase';
import { User } from './User';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { dateCompletAbv, getInfosCours, getUserName } from '../Utils/utils';

enum ELogAction {
    AjoutItem = 'ajoutItem',
    DuplicationItem = 'duplicationItem',
    Modification = 'modification',
    Supression = 'supression',
    Unknow = 'unknow'
}

class Log {
    public date: Timestamp;
    public user: string;
    public action: ELogAction;
    public data: string;
    public id: string;

    constructor(date: Timestamp, user: string, action: ELogAction, data: string) {
        this.date = date;
        this.user = user || 'unknow';
        this.action = action || ELogAction.Unknow;
        this.data = data || 'none';
        this.id = '';
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

    public getUserName(users: User[]): string {
        return getUserName(users, this.user);
    }

    public get actionName(): string {
        switch (this.action) {
            case ELogAction.AjoutItem:
                return 'Nouveau Cours';
            case ELogAction.DuplicationItem:
                return 'Duplication';
            case ELogAction.Modification:
                return 'Modification';
            case ELogAction.Unknow:
                return 'Unknow';
            case ELogAction.Supression:
                return 'Supression';
            default:
                return 'Erreur ?!';
        }
    }

    public get infos(): string {
        switch (this.action) {
            case ELogAction.AjoutItem:
            case ELogAction.Supression:
                return getInfosCours(this.data);
            case ELogAction.DuplicationItem:
                return '';
            case ELogAction.Modification:
                return 'Modification';
            case ELogAction.Unknow:
                return 'Unknow';
            default:
                return 'Erreur ?!';
        }
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
