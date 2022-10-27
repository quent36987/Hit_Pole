/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReserverButton from '../componants/Reserver';
import { AppState } from '../Context';
import { Item } from '../data/Item';
import IPage from '../interfaces/page';
import { getAllItemMonth } from '../Utils/firebaseUtils';
import { DateAbv, DateFormatAbv, mois } from '../Utils/utils';
import './allPage.css';

const CalendrierPage: React.FunctionComponent<IPage> = (props) => {
    const { user, setAlert } = AppState();
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const [datenow, setDatenow] = useState(new Date());
    const [datenow_firstweek, setDatenow_firstweek] = useState(new Date());
    const [data, setData] = useState<Item[]>([]);
    const [type, setType] = useState('semaine'); // mois,semaine,jour

    useEffect(() => {
        if (datenow.getDay() !== 1) {
            setDatenow_firstweek(
                new Date(
                    datenow.getFullYear(),
                    datenow.getMonth(),
                    datenow.getDate() - datenow.getDay() + 1
                )
            );
        } else {
            setDatenow_firstweek(datenow);
        }
    }, [datenow]);

    useEffect(() => {
        getData();
    }, [datenow.getMonth()]);

    async function getData() {
        setData(await getAllItemMonth(datenow));
    }

    function getweek(date: Date): Date[] {
        const week = [];

        for (let i = 0; i < 7; i++) {
            week.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() + i));
        }

        return week;
    }

    function Calendar(datenow: Date) {
        const firstDay =
            ((new Date(datenow.getFullYear(), datenow.getMonth(), 1).getDay() - 1) % 7) - 1;

        const table = [];

        for (let i = 0; i < 6; i++) {
            table.push(
                [0, 1, 2, 3, 4, 5, 6].map((j) => {
                    const date = new Date(
                        datenow.getFullYear(),
                        datenow.getMonth(),
                        i * 7 + j - firstDay
                    );

                    if (date.getMonth() !== datenow.getMonth()) {
                        return <div className="calendar-table__item_2">{date.getDate()}</div>;
                    }

                    return (
                        <div
                            className="calendar-table__item"
                            onClick={() => {
                                setDatenow(date);
                                setType('jour');
                            }}
                            style={{
                                backgroundColor:
                                    date.getDate() === new Date().getDate() &&
                                    date.getMonth() === new Date().getMonth()
                                        ? '#77777749'
                                        : ''
                            }}
                        >
                            {date.getDate()}
                            {data
                                .filter(
                                    (item) =>
                                        item.date.toDate().getDate() === date.getDate() &&
                                        item.date.toDate().getMonth() === date.getMonth()
                                )
                                .map((item) => {
                                    return (
                                        <div
                                            className={
                                                user && item.users.includes(user.uid)
                                                    ? 'calendar-table__item_item'
                                                    : 'calendar-table__item_item2'
                                            }
                                        >
                                            {item.titre}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })
            );
        }

        return table;
    }

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h1 className="Titre"> Calendrier 📅</h1>
            </div>

            <div>
                <div>
                    <div className="calendar-container__body">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <div
                                className={
                                    type === 'mois' ? 'calendar-type-choix' : 'calendar-type'
                                }
                                onClick={() => setType('mois')}
                            >
                                Mois
                            </div>
                            <div
                                className={
                                    type === 'semaine' ? 'calendar-type-choix' : 'calendar-type'
                                }
                                onClick={() => setType('semaine')}
                            >
                                Semaine
                            </div>
                            <div
                                className={
                                    type === 'jour' ? 'calendar-type-choix' : 'calendar-type'
                                }
                                onClick={() => setType('jour')}
                            >
                                Jour
                            </div>
                        </div>

                        {type === 'mois' ? (
                            <>
                                <div className="calendar_header">
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth() - 1,
                                                    1
                                                )
                                            )
                                        }
                                    >
                                        {'◀️'}
                                    </div>
                                    <div className="calendar_header_item_centre">
                                        {mois[datenow.getMonth()]}
                                    </div>
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth() + 1,
                                                    1
                                                )
                                            )
                                        }
                                    >
                                        {'▶️'}
                                    </div>
                                </div>
                                <div className="calendar-table__header">
                                    <div className="calendar-table__col">M</div>
                                    <div className="calendar-table__col">T</div>
                                    <div className="calendar-table__col">W</div>
                                    <div className="calendar-table__col">T</div>
                                    <div className="calendar-table__col">F</div>
                                    <div className="calendar-table__col">S</div>
                                    <div className="calendar-table__col">S</div>
                                </div>
                                <div className="calendar-table">{Calendar(datenow)}</div>
                            </>
                        ) : null}

                        {type === 'semaine' ? (
                            <>
                                <div className="calendar_header">
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth(),
                                                    datenow.getDate() - 7
                                                )
                                            )
                                        }
                                    >
                                        {'◀️'}
                                    </div>
                                    <div className="calendar_header_item_centre">
                                        {DateAbv(datenow_firstweek)} -{' '}
                                        {DateAbv(
                                            new Date(
                                                datenow_firstweek.getFullYear(),
                                                datenow_firstweek.getMonth(),
                                                datenow_firstweek.getDate() + 6
                                            )
                                        )}
                                    </div>
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth(),
                                                    datenow.getDate() + 7
                                                )
                                            )
                                        }
                                    >
                                        {'▶️'}
                                    </div>
                                </div>
                                <div className="semaine">
                                    {getweek(datenow_firstweek).map((item) => (
                                        <>
                                            <div className="jour">{DateFormatAbv(item)}</div>
                                            {data
                                                .filter(
                                                    (item2) =>
                                                        item2.date.toDate().getDate() ===
                                                            item.getDate() &&
                                                        item2.date.toDate().getMonth() ===
                                                            item.getMonth()
                                                )
                                                .map((item2) => (
                                                    <div className="carte">
                                                        <div className="carte-info">
                                                            <div className="carte-info-1">
                                                                <div className="carte-info-heure">
                                                                    {item2.getHour()}
                                                                </div>
                                                                <div className="carte-info-titre">
                                                                    {item2.titre} - {item2.niveau}
                                                                </div>
                                                                <div className="carte-info-plus">
                                                                    {item2.place -
                                                                        item2.users.length}
                                                                    /{item2.place}{' '}
                                                                    {'place(s) dispo'}
                                                                </div>
                                                            </div>
                                                            <span className="carte-info-2">
                                                                <ReserverButton
                                                                    item={item2}
                                                                    userId={user ? user.uid : null}
                                                                    cb={async () => await getData()}
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {type === 'jour' ? (
                            <>
                                <div className="calendar_header">
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth(),
                                                    datenow.getDate() - 1
                                                )
                                            )
                                        }
                                    >
                                        {'◀️'}
                                    </div>
                                    <div className="calendar_header_item_centre">
                                        {datenow.toLocaleDateString()}
                                    </div>
                                    <div
                                        className="calendar_header_item"
                                        onClick={() =>
                                            setDatenow(
                                                new Date(
                                                    datenow.getFullYear(),
                                                    datenow.getMonth(),
                                                    datenow.getDate() + 1
                                                )
                                            )
                                        }
                                    >
                                        {'▶️'}
                                    </div>
                                </div>

                                <div className="semaine">
                                    <div className="jour">{DateFormatAbv(datenow)}</div>
                                    {data
                                        .filter(
                                            (item) =>
                                                item.date.toDate().getDate() ===
                                                    datenow.getDate() &&
                                                item.date.toDate().getMonth() === datenow.getMonth()
                                        )
                                        .map((item2) => (
                                            <div className="carte">
                                                <div className="carte-info">
                                                    <div className="carte-info-1">
                                                        <div className="carte-info-heure">
                                                            {item2.getHour()}
                                                        </div>
                                                        <div className="carte-info-titre">
                                                            {item2.titre} - {item2.niveau}
                                                        </div>
                                                        <div className="carte-info-plus">
                                                            {item2.place - item2.users.length}/
                                                            {item2.place} {'place(s) dispo'}
                                                        </div>
                                                    </div>
                                                    <span className="carte-info-2">
                                                        <ReserverButton
                                                            item={item2}
                                                            userId={user ? user.uid : null}
                                                            cb={async () => await getData()}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                    {data.filter(
                                        (item) =>
                                            item.date.toDate().getDate() === datenow.getDate() &&
                                            item.date.toDate().getMonth() === datenow.getMonth()
                                    ).length === 0 ? (
                                        <div>Aucun cours prévus ce {jours[datenow.getDay()]}</div>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendrierPage;
