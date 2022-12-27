import { db } from '../firebase';
import { Item } from '../data/Item';
import { User } from '../data/User';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

export const MOIS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const JOURS_ABV = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

function dateFormat(date: Date): string {
    // format : lundi 4 juillet à 20h30
    return `${JOURS[date.getDay()]} ${date.getDate()} ${MOIS[date.getMonth()]} à ${
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    }h${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
}

function dateFormatAbv(date: Date): string {
    // format : lun, 4 juillet
    return `${JOURS_ABV[date.getDay()]}, ${date.getDate()} ${MOIS[date.getMonth()]}`;
}

function timeAbv(date: Date): string {
    // format : 20h45
    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}h${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
}

function dateAbv(date: Date): string {
    // format 01/05
    return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/${
        date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }`;
}

function dateTimeAbv(date: Date): string {
    // format  lun, 4/09 15h50
    return `${JOURS_ABV[date.getDay()]},${dateAbv(date)} - ${timeAbv(date)}`;
}

function dateCompletAbv(date: Date): string {
    // format  4/09 - 15h50
    return `${dateAbv(date)} - ${timeAbv(date)}`;
}

async function annuler(item: Item, setAlert, userId): Promise<boolean> {
    if (
        userId == null ||
        item.date.toDate() < new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    ) {
        setAlert({
            open: true,
            type: 'error',
            message: 'Vous ne pouvez pas annuler un cours qui est dans moins de 24h'
        });

        return false;
    }

    const CaldendarDocRef = doc(db, 'calendrier', item.id);

    try {
        await updateDoc(CaldendarDocRef, { users: arrayRemove(userId) });
    } catch (error) {
        setAlert({
            open: true,
            type: 'error',
            message: 'Une error est survenue, veuillez réessayer ultérieurement.'
        });
    }
}

async function reserver(item: Item, setAlert, userId): Promise<boolean> {
    if (userId == null) {
        setAlert({
            open: true,
            type: 'error',
            message: 'Vous devez être connecté pour réserver un événement'
        });

        return false;
    }

    try {
        const CaldendarDocRef = doc(db, 'calendrier', item.id);

        await updateDoc(CaldendarDocRef, { users: arrayUnion(userId) });

        setAlert({
            open: true,
            type: 'success',
            message: "Vous avez réservé l'événement"
        });

        return true;
    } catch (error) {
        console.log(error);
    }

    return false;
}

// list
function getUserName(users: User[], userId: string): string {
    const user = users.find((user) => user.id === userId);

    if (user != null) {
        return user.getFullName;
    }

    if (userId.startsWith('F_')) {
        return userId.split('_')[2];
    }

    return userId;
}

export {
    dateFormat,
    dateCompletAbv,
    dateFormatAbv,
    dateAbv,
    timeAbv,
    dateTimeAbv,
    annuler,
    reserver,
    getUserName
};
