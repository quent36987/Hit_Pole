import { Timestamp } from 'firebase/firestore';

function getFullWeek(monday: Date): Date[] {
    const days = [];

    for (let i = 0; i < 7; i++) {
        days.push(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }

    return days;
}

function toDate(timestamp: Timestamp): Date {
    return new Timestamp(timestamp.seconds, 0).toDate();
}

export { getFullWeek, toDate };
