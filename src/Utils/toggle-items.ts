export interface IToggleItem<T> {
    item: T;
    id: number;
    toggle: boolean;
    label?: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type TToggleItems<T> = Array<IToggleItem<T>>;

function listToToggleList<T>(list: T[], allToggle = false): TToggleItems<T> {
    return list.map((item, index) => {
        return { item, toggle: allToggle, id: index };
    });
}

function getItems<T>(list: TToggleItems<T>): T[] {
    return list.map((elt) => elt.item);
}

function getToggleList<T>(list: TToggleItems<T>, toggle = true): T[] {
    return getItems(list.filter((elt) => elt.toggle === toggle));
}

function countSelectedItem(list: TToggleItems<any>): number {
    return list.filter((item) => {
        return item.toggle;
    }).length;
}

function toggleItem<T>(items: TToggleItems<T>, itemId: number, newValue: boolean): TToggleItems<T> {
    items.find((item) => item.id === itemId).toggle = newValue;

    return items;
}

export { listToToggleList, getToggleList, countSelectedItem, toggleItem, getItems };
