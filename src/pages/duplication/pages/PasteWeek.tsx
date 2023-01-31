import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getWeek, toggleItem } from '../utils';
import { Item } from '../../../data/Item';
import { IToggleItem, TToggleItems } from '../interfaces';

interface IStateProps {
    items: Item[];
}

const PasteWeek: React.FunctionComponent<IPage & RouteComponentProps<any, any, IStateProps>> = (
    props
) => {
    const history = useHistory();

    const [weeks, setWeeks] = useState<TToggleItems<Date>>([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const onSubmit = (e): void => {
        e.preventDefault();

        history.push({
            pathname: '/duplication/paste-validation',
            state: {
                items: props.location.state.items,
                weeks: itemsSelected()
            }
        });
    };

    function itemsSelected(): Date[] {
        return weeks.filter((item) => item.toggle).map((item) => item.item);
    }

    useEffect(() => {
        setWeeks(getWeek());
    }, [props.location]);

    function selectItem(element: IToggleItem<Date>): void {
        setWeeks(toggleItem(weeks, element.id, !element.toggle));

        setIsUpdate(!isUpdate);
    }

    return (
        <div>
            <h1>Selectionner les semaines ou vous souhaitez dupliquer les x cours copier</h1>
            <form onSubmit={onSubmit}>
                {weeks.map((item, index) => {
                    return (
                        <div key={index}>
                            <input
                                type="checkbox"
                                checked={item.toggle}
                                onChange={(e) => {
                                    selectItem(item);
                                }}
                            />
                            {item.label}
                        </div>
                    );
                })}
                <button>Valider</button>
            </form>
        </div>
    );
};

export { PasteWeek };
