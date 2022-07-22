import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './allPage.css';
import logging from '../config/logging';
import { collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { AppState } from '../Context';
import { db } from '../firebase';



const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [data, setData] = useState([]);
    const { user, setAlert, perm } = AppState();


    async function name() {
        console.log("e");
        const q = query(collection(db, "calendrier").withConverter(ItemConverter),
         where('users', 'array-contains', user.uid),
         where("date", ">", Timestamp.fromDate(new Date())),
         orderBy("date"), 
         limit(5));

        const querySnapshot = await getDocs(q);
        console.log("p"); const list: Item[] = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots


            const exo = doc.data();
            exo.id = doc.id;
            list.push(exo);

            //setData(list);

        });
        setData(list);
        console.log("pub", data);
    }


    useEffect(() => {

        if (user) {
            name();
        }




        return;

        logging.info(`Loading ${props.name}`);
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        const queryRef = query(collectionRef, orderBy("date"), limit(3)
            //,where('users','array-contains','a8PsQr6Z7KX4qwaeiscQ3ZxkPgW2')
            , where('users', 'array-contains', 'a8PsQr6Z7KX4qwaeiscQ3ZxkPgW2')
        );




        console.log(queryRef)
        onSnapshot(queryRef, (snapshot) => {
            console.log("oco")
            const list: Item[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            //setData(list);
            console.log("pub", data);
        });

    }, [user])


    return (
        <div className="container">
            <h1 className='Titre' >Profile 👩</h1>
            <div className="HomePage-content">
                Mes prochains cours réservés:
                {data.map((data) => (
                    data.WithHeaderExample(user, setAlert)
                ))}
            </div>
        </div>
    );
}

export default withRouter(ProfilePage);