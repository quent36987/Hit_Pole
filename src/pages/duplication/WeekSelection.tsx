import { getFullWeek } from '../../Utils/time';
import { dateFormatAbv } from '../../Utils/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { Item } from '../../data/Item';
import { IToggleItem, TToggleItems } from './interfaces';
import '../allPage.css';

const WeekSelection = (props: {
    monday: Date;
    items: TToggleItems<Item>;
    selectItem: (element: IToggleItem<Item>) => void;
}): JSX.Element => {
    return (
        <div className="semaine">
            {props.monday !== null &&
                getFullWeek(props.monday).map((day) => (
                    <>
                        <div className="jour">{dateFormatAbv(day)}</div>
                        {props.items
                            .filter(
                                (filteredItem) =>
                                    filteredItem.item.date.toDate().getDate() === day.getDate() &&
                                    filteredItem.item.date.toDate().getMonth() === day.getMonth()
                            )
                            .map((item) => (
                                <div
                                    key={`carte-${item.id}`}
                                    className="carte"
                                    onClick={() => props.selectItem(item)}>
                                    <div className="carte-info">
                                        <div>
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                checked={item.toggle}
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
    );
};

WeekSelection.propTypes = {
    selectItem: PropTypes.func.isRequired,
    monday: PropTypes.instanceOf(Date).isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            item: PropTypes.instanceOf(Item).isRequired,
            id: PropTypes.number.isRequired,
            toggle: PropTypes.bool.isRequired
        })
    ).isRequired
};

export { WeekSelection };
