import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';

import '../../allPage.css';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getAllItemBetweenDate } from '../../../Utils/firebase/firebaseGet';
import { Item } from '../../../data/Item';
import { IToggleItem, TToggleItems } from '../interfaces';
import { DUPLICATION_PATH } from '../constants';
import { listToToggleList, toggleItem } from '../utils';
import { WeekSelection } from '../WeekSelection';

interface IStateProps {
    monday?: Date;
}

const CopyValidation: React.FunctionComponent<
    IPage & RouteComponentProps<any, any, IStateProps>
> = (props) => {
    const history = useHistory();

    const [items, setItems] = useState<TToggleItems<Item>>([]);
    const [monday, setMonday] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const onSubmit = (e): void => {
        e.preventDefault();

        history.push({
            pathname: `/${DUPLICATION_PATH}/paste-week`,
            state: { items: itemsSelected() }
        });
    };

    async function loadData(): Promise<void> {
        const FIRST_DAY = props.location.state.monday;

        const END_DAY = new Date(
            FIRST_DAY.getFullYear(),
            FIRST_DAY.getMonth(),
            FIRST_DAY.getDate() + 7
        );

        const weekItems = await getAllItemBetweenDate(FIRST_DAY, END_DAY);

        const selectedItem = listToToggleList<Item>(weekItems, true);

        setItems(selectedItem);
        setMonday(props.location.state.monday);
    }

    useEffect(() => {
        if (
            typeof props.location.state !== 'undefined' &&
            typeof props.location.state.monday !== 'undefined'
        ) {
            loadData().catch(console.error);
        } else {
            history.goBack();
        }
    }, [props.location]);

    function itemsSelected(): Item[] {
        return items.filter((item) => item.toggle).map((item) => item.item);
    }

    function selectedCount(): number {
        return items.filter((item) => {
            return item.toggle;
        }).length;
    }

    function selectItem(element: IToggleItem<Item>): void {
        setItems(toggleItem(items, element.id, !element.toggle));

        setIsUpdate(!isUpdate);
    }

    return (
        <div className="DuplicaPage">
            <form onSubmit={onSubmit}>
                <h1>Valider les cours a copier</h1>
                <WeekSelection monday={monday} items={items} selectItem={selectItem} />

                <button>{`Dupliquer ses ${selectedCount()} cour(s)`}</button>
            </form>
        </div>
    );
};

export { CopyValidation };
