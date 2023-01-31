import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Item } from '../../../data/Item';
import {
    countSelectedItem,
    createDuplicateItem,
    getToggleList,
    listToToggleList,
    toggleItem
} from '../utils';
import { IToggleItem, TToggleItems } from '../interfaces';
import { WeekSelection } from '../WeekSelection';
import { sendItem } from '../../../Utils/firebase/firebasePut';
import { useToast } from '../../../toast';
import { AppState } from '../../../Context';
import { ELogAction, Log } from '../../../data/Log';
import { Timestamp } from 'firebase/firestore';

interface ILocationProps {
    items: Item[];
    weeks: Date[];
}

const PasteValidation: React.FunctionComponent<
    IPage & RouteComponentProps<any, any, ILocationProps>
> = (props) => {
    const history = useHistory();
    const { user } = AppState();
    const toast = useToast();

    const [items, setItems] = useState<TToggleItems<Item>>([]);
    const [weeks, setWeeks] = useState<Date[]>([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const onSubmit = async (e): Promise<void> => {
        e.preventDefault();
        toast.openInfo('En cours de duplication');

        const itemsToCreate = getToggleList(items);

        await new Log(
            Timestamp.fromDate(new Date()),
            user.uid,
            ELogAction.DuplicationItem,
            JSON.stringify({ lenght: itemsToCreate.length })
        ).submit();

        for (const item of itemsToCreate) {
            await sendItem(item, user.uid);
        }

        toast.openSuccess('Duplication Reussi !');

        history.push('/');
    };

    useEffect(() => {
        const state = props.location.state;

        if (
            typeof state === 'undefined' ||
            typeof state.weeks === 'undefined' ||
            typeof state.items === 'undefined'
        ) {
            history.push('duplication/');
        }

        setItems(listToToggleList<Item>(createDuplicateItem(state.items, state.weeks), true));
        setWeeks(state.weeks);
        setIsUpdate(!isUpdate);
    }, [props.location]);

    function selectItem(element: IToggleItem<Item>): void {
        setItems(toggleItem(items, element.id, !element.toggle));

        setIsUpdate(!isUpdate);
    }

    return (
        <div className="DuplicaPage">
            <div className="duplication-titre">Valider les cours a créer</div>
            <form onSubmit={onSubmit}>
                {weeks.map((monday) => WeekSelection({ monday, items, selectItem }))}
                <button className="submit-button">
                    {`Dupliquer ses ${countSelectedItem(items)} cour(s)`}
                </button>
            </form>
        </div>
    );
};

export { PasteValidation };
