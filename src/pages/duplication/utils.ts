import { getEmptyItem, Item } from '../../data/Item';
import { Timestamp } from 'firebase/firestore';
import { TToggleItems } from './interfaces';
import { toDate } from '../../Utils/time';

const mois = [
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

function getFrenchDay(englishDay: number): number {
    return englishDay === 0 ? 6 : englishDay - 1;
}

function listToToggleList<T>(list: T[], allToggle = false): TToggleItems<T> {
    return list.map((item, index) => {
        return { item, toggle: allToggle, id: index };
    });
}

function toggleItem<T>(items: TToggleItems<T>, itemId: number, newValue: boolean): TToggleItems<T> {
    items.find((item) => item.id === itemId).toggle = newValue;

    return items;
}

function createDuplicateItem(itemsRef: Item[], weeks: Date[]): Item[] {
    const items = [];

    for (const item of itemsRef) {
        for (const monday of weeks) {
            const date = Timestamp.fromDate(
                new Date(
                    monday.getFullYear(),
                    monday.getMonth(),
                    monday.getDate() + getFrenchDay(toDate(item.date).getDay()),
                    toDate(item.date).getHours(),
                    toDate(item.date).getMinutes()
                )
            );

            items.push(
                getEmptyItem(item.titre, item.desc, date, item.temps, item.place, item.niveau)
            );
        }
    }

    return items;
}

function getMonday(semaine: number, annee: number): Date {
    const firstMonday = new Date(annee, 0, 1);

    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() + 1);
    }

    const decal = firstMonday.getDay() - 1;

    return new Date(
        firstMonday.getFullYear(),
        firstMonday.getMonth(),
        firstMonday.getDate() + decal + semaine * 7
    );
}

function getWeek(): TToggleItems<Date> {
    const week = [];

    const firstMonday = new Date();

    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() + 1);
    }

    const decal = firstMonday.getDay() - 1;

    for (let i = 0; i < 52; i++) {
        const date = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7
        );

        const date2 = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7 + 6
        );

        week.push({
            id: i,
            toggle: false,
            item: date,
            label: `${date.toLocaleDateString()} to ${date2.toLocaleDateString()} (${
                mois[date.getMonth()]
            })`
        });
    }

    return week;
}

function getSemaine(annee: number): string[] {
    const semaines = [];

    const datefirst = [];
    // get the first monday of the year
    const firstMonday = new Date(annee, 0, 1);

    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() + 1);
    }

    console.log('first monday', firstMonday.toString(), firstMonday.getDay());

    const decal = firstMonday.getDay() - 1;

    // return all weeks (monday to sunday) of the year with the format "DD/MM to DD/MM"
    for (let i = 0; i < 52; i++) {
        const date = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7
        );

        const date2 = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7 + 6
        );

        semaines.push(
            date.toLocaleDateString() +
                ' to ' +
                date2.toLocaleDateString() +
                '  (' +
                mois[date.getMonth()] +
                ')'
        );

        datefirst.push(date);
    }

    return semaines;
}

export { getSemaine, getMonday, getWeek, createDuplicateItem, listToToggleList, toggleItem };
