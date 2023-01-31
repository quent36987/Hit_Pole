import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Item } from '../../../data/Item';
import { createDuplicateItem, listToToggleList } from '../utils';
import { TToggleItems } from '../interfaces';

interface ILocationProps {
    items: Item[];
    weeks: Date[];
}

const PasteValidation: React.FunctionComponent<
    IPage & RouteComponentProps<any, any, ILocationProps>
> = (props) => {
    const [items, setItems] = useState<TToggleItems<Item>>([]);
    const history = useHistory();
    const [isUpdate, setIsUpdate] = useState(false);

    const onSubmit = (e): void => {
        e.preventDefault();

        console.log('DUPLICATION', items);
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

        setItems(listToToggleList<Item>(createDuplicateItem(state.items, state.weeks)));
        setIsUpdate(!isUpdate);
    }, [props.location]);

    function selectedCount(): number {
        return items.filter((item) => {
            return item.toggle;
        }).length;
    }

    return (
        <div className="DuplicaPage">
            <form onSubmit={onSubmit}>
                <h1>Valider les cours a copier</h1>

                <button>{`Dupliquer ses ${selectedCount()} cour(s)`}</button>
            </form>
        </div>
    );
};

export { PasteValidation };
