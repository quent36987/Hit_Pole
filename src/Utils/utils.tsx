/* eslint-disable */
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Item } from '../data/Item';
import { User } from '../data/User';
import { db } from '../firebase';

export const mois = [
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
const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const jours_abv = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

export function StringSymplify(name: string) {
    let name_modif = name
        .replace(/\((.)*\)/g, '')
        .replace(/([0-9]+[\s]*([àaou]|ou)[\s]*[0-9]+)*/g, '')
        .replace(/[\s\d-+'*]/g, '')
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (name_modif.endsWith('s')) {
        name_modif = name_modif.substring(0, name_modif.length - 1);
    }

    return name_modif;
}

export function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    if (seconds < 10) {
        return `${minutes}:0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

export function DateFormat(date: Date) {
    // format : lundi 4 juillet à 20h30
    return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} à ${
        date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    }h${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
}

export function DateFormatAbv(date: Date) {
    // format : lun, 4 juillet
    return `${jours_abv[date.getDay()]}, ${date.getDate()} ${mois[date.getMonth()]}`;
}

export function TimeAbv(date: Date) {
    // format : 20h45
    return `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}h${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    }`;
}

export function DateAbv(date: Date) {
    // format 01/05
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    }`;
}

export function DateTimeAbv(date: Date) {
    // format  lun, 4/09 15h50
    return `${jours_abv[date.getDay()]},${DateAbv(date)} - ${TimeAbv(date)}`;
}

export async function Annuler(item: Item, setAlert, userId) {
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

export async function Reserver(item: Item, setAlert, userId) {
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
export function getUserName(users: User[], userId: string): string {
    const user = users.find((user) => user.id == userId);

    if (user != null) {
        return user.getFullName();
    }

    if (userId.startsWith('F_')) {
        return userId.split('_')[2];
    }

    return userId;
}
