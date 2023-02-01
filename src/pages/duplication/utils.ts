import { getEmptyItem, Item } from '../../data/Item';
import { Timestamp } from 'firebase/firestore';
import { toDate } from '../../Utils/time';
import { MOIS } from './constants';
import { TToggleItems } from '../../Utils/toggle-items';

function getFrenchDay(englishDay: number): number {
    return englishDay === 0 ? 6 : englishDay - 1;
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

function getWeek(annee: number | null = null): TToggleItems<Date> {
    const week = [];
    console.log('test');
    const firstMonday = annee === null ? new Date() : new Date(annee, 0, 1);

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
                MOIS[date.getMonth()]
            })`
        });
    }

    return week;
}

export { getWeek, createDuplicateItem };
