import './allPage.css';
import { AppState } from '../Context';
import { db } from '../firebase';
import { IPage } from '../interfaces/page';
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where
} from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import React, { useEffect, useState } from 'react';

const HomePage: React.FunctionComponent<IPage> = (props) => {
    const [data, setData] = useState([]);
    const { user } = AppState();

    useEffect(() => {
        const collectionRef = collection(db, 'calendrier').withConverter<Item>(ItemConverter);

        const queryRef = query(
            collectionRef,
            orderBy('date'),
            limit(3),
            where('date', '>', Timestamp.fromDate(new Date()))
        );

        onSnapshot(queryRef, (snapshot) => {
            const list: Item[] = [];

            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });

            setData(list);
        });
    }, [props.name]);

    return (
        <div className="HomePage">
            <h1 className="Titre">Prochains évenements à venir:</h1>
            <div className="HomePage-content">
                {data.map((data) => data.WithHeaderExample(user))}
            </div>
        </div>
    );
};

export { HomePage };
