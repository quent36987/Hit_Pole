import React, { useEffect, useState } from 'react';
import { IPage } from '../../../interfaces/page';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { getWeek } from '../utils';
import { Item } from '../../../data/Item';
import './duplication.css';
import { getToggleList, IToggleItem, toggleItem, TToggleItems } from '../../../Utils/toggle-items';

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
                weeks: getToggleList(weeks)
            }
        });
    };

    useEffect(() => {
        setWeeks(getWeek());
    }, [props.location]);

    function selectItem(element: IToggleItem<Date>): void {
        setWeeks(toggleItem(weeks, element.id, !element.toggle));

        setIsUpdate(!isUpdate);
    }

    return (
        <div>
            <div className="duplication-titre">
                Selectionner les semaines où vous souhaitez coller les cours copier
            </div>
            <form onSubmit={onSubmit}>
                {weeks.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="weeks-duplication"
                            onClick={() => {
                                selectItem(item);
                            }}>
                            <input className="checkbox" type="checkbox" checked={item.toggle} />
                            <div>{item.label}</div>
                        </div>
                    );
                })}
                <button className="submit-button">Valider</button>
            </form>
        </div>
    );
};

export { PasteWeek };
