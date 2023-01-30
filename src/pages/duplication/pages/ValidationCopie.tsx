import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';

import '../../allPage.css';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getAllItemBetweenDate } from '../../../Utils/firebase/firebaseGet';
import { dateFormatAbv } from '../../../Utils/utils';
import { Item } from '../../../data/Item';

const ValidationCopie: React.FunctionComponent<
    IPage & RouteComponentProps<any, any, { monday?: Date }>
> = (props) => {
    const history = useHistory();
    const [items, setItems] = useState<Array<{ item: Item; selected: boolean }>>([]);
    const [monday, setMonday] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const onSubmit = (e): void => {
        e.preventDefault();

        const location = {
            pathname: '/duplication/choix-duplication',
            state: { items: itemsSelected() }
        };

        history.push(location);
    };

    function getweek(date: Date): Date[] {
        const week = [];

        for (let i = 0; i < 7; i++) {
            week.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() + i));
        }

        return week;
    }

    async function loadData(): Promise<void> {
        const FIRST_DAY = props.location.state.monday;

        const END_DAY = new Date(
            FIRST_DAY.getFullYear(),
            FIRST_DAY.getMonth(),
            FIRST_DAY.getDate() + 7
        );

        const weekItems = await getAllItemBetweenDate(FIRST_DAY, END_DAY);

        const selectedItem = weekItems.map((item) => {
            return {
                item,
                selected: true
            };
        });

        setItems(selectedItem);
        setMonday(props.location.state.monday);
        console.log('data', selectedItem, monday);
    }

    useEffect(() => {
        if (typeof props.location.state.monday !== 'undefined') {
            loadData().catch(console.error);
        }
    }, [props.location]);

    function selectItem(item: Item, selected: boolean): void {
        setItems((oldItems) => {
            oldItems.find((elt) => elt.item.id === item.id).selected = selected;
            console.log(oldItems);

            return oldItems;
        });

        setIsUpdate(!isUpdate);
    }

    function itemsSelected(): Item[] {
        return items.filter((item) => item.selected).map((item) => item.item);
    }

    function selectedCount(): number {
        return items.filter((item) => {
            return item.selected;
        }).length;
    }

    return (
        <div className="DuplicaPage">
            <form onSubmit={onSubmit}>
                <h1>Valider les cours a copier</h1>
                <div className="semaine">
                    {monday !== null &&
                        getweek(monday).map((day) => (
                            <>
                                <div className="jour">{dateFormatAbv(day)}</div>
                                {items
                                    .filter(
                                        (filteredItem) =>
                                            filteredItem.item.date.toDate().getDate() ===
                                                day.getDate() &&
                                            filteredItem.item.date.toDate().getMonth() ===
                                                day.getMonth()
                                    )
                                    .map((item, index) => (
                                        <div key={`carte-${index}`} className="carte">
                                            <div className="carte-info">
                                                <div>
                                                    <input
                                                        className="checkbox"
                                                        type="checkbox"
                                                        checked={item.selected}
                                                        onChange={(e) =>
                                                            selectItem(item.item, !item.selected)
                                                        }
                                                    />
                                                </div>
                                                <div className="carte-info-1">
                                                    <div className="carte-info-heure">
                                                        {item.item.getHour()}
                                                    </div>
                                                    <div className="carte-info-titre">
                                                        {item.item.titre} - {item.item.niveau}
                                                    </div>
                                                    <div className="carte-info-plus">
                                                        {item.item.place} {'place(s) dispo'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </>
                        ))}
                </div>
                <button>{`Dupliquer ses ${selectedCount()} cour(s)`}</button>
            </form>
        </div>
    );
};

export { ValidationCopie };
