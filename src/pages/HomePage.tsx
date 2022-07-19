import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { arrayUnion, collection, doc, limit, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemConverter } from '../data/Item';
import { DateFormat, Reserver } from '../Utils/utils';
import { AppState } from '../Context';


const HomePage: React.FunctionComponent<IPage> = props => {
    const [data, setData] = useState([]);
    const { user, setAlert, perm } = AppState();
    


    useEffect(() => {
        logging.info(`Loading ${props.name}`);

        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        const queryRef = query(collectionRef,orderBy("date"),limit(3),where("date", ">", Timestamp.fromDate(new Date())));
        onSnapshot(queryRef, (snapshot) => {
            const list: Item[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setData(list);
            console.log("pub" , data);
        });
    }, [props.name])


    
   


    


    return (
        <div className='HomePage'>
            <h1 className='Titre' >Futur évenements à venir:</h1>

                <div className="HomePage-content">
                    {data.map((data) => (
                        data.WithHeaderExample(user,setAlert)
                    ))}
                    
                    

                </div>
        </div>
    )
}

export default HomePage;
