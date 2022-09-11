import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import { collection, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemConverter } from '../data/Item';
import { AppState } from '../Context';


const HomePage: React.FunctionComponent<IPage> = props => {
    const [data, setData] = useState([]);
    const { user, setAlert } = AppState();



    useEffect(() => {
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        const queryRef = query(collectionRef, orderBy("date"), limit(3), where("date", ">", Timestamp.fromDate(new Date())));

        onSnapshot(queryRef, (snapshot) => {
            const list: Item[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setData(list);
        });
    }, [props.name])


    return (
        <div className='HomePage'>
            <h1 className='Titre' >Prochains évenements à venir:</h1>
            <div className="HomePage-content">
                {data.map((data) => (
                    data.WithHeaderExample(user, setAlert)
                ))}
            </div>
        </div>
    )
}

export default HomePage;
