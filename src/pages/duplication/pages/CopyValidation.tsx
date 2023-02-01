import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import '../../allPage.css';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getAllItemBetweenDate } from '../../../Utils/firebase/firebaseGet';
import { Item } from '../../../data/Item';
import { DUPLICATION_PATH } from '../constants';
import { WeekSelection } from '../WeekSelection';
import {
    countSelectedItem,
    getToggleList,
    IToggleItem,
    listToToggleList,
    toggleItem,
    TToggleItems
} from '../../../Utils/toggle-items';

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
            state: { items: getToggleList(items) }
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

    function selectItem(element: IToggleItem<Item>): void {
        setItems(toggleItem(items, element.id, !element.toggle));

        setIsUpdate(!isUpdate);
    }

    return (
        <div className="duplication-page">
            <div className="duplication-titre">Valider les cours à copier</div>
            <form onSubmit={onSubmit}>
                <WeekSelection monday={monday} items={items} selectItem={selectItem} />

                <button className="submit-button">
                    {`Copier ses ${countSelectedItem(items)} cour(s)`}
                </button>
            </form>
        </div>
    );
};

export { CopyValidation };
