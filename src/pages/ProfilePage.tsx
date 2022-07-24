import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './allPage.css';
import logging from '../config/logging';
import { collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { AppState } from '../Context';
import { db } from '../firebase';
import { Button, Spinner } from 'react-bootstrap';



const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [data, setData] = useState([]);
    const [dataUser, setdataUser] = useState(null);
    const { user, setAlert, perm } = AppState();

    async function LoadItem() {
        console.log("e");
        const q = query(collection(db, "calendrier").withConverter(ItemConverter),
         where('users', 'array-contains', user.uid),
         where("date", ">", Timestamp.fromDate(new Date())),
         orderBy("date"), 
         limit(5));
        const querySnapshot = await getDocs(q);
        console.log("p"); const list: Item[] = [];
        querySnapshot.forEach((doc) => {
            const exo = doc.data();
            exo.id = doc.id;
            list.push(exo);
        });
        setData(list);
        console.log("pub", data);
    }


    useEffect(() => {
        if (user) {
            LoadItem();
        }
    }, [user])


    return (
        <div className="container" style={{"textAlign":"center"}}>
            <h1 className='Titre' >Profile 👩</h1>
            {user ?
            <div className="HomePage-content">
                Mes prochains cours réservés:
                {data.length == 0 ? 
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                :
                    <>{data.map((data) => (
                        data.WithHeaderExample(user, setAlert)
                    ))}</>
                }
            </div>
            :
            <div>
                <div>
                    Connecte toi pour avoir acces au profile !
                </div>
                <Button variant="outline-success" href="/auth/login" >Login</Button>
            </div> 
            }
        </div>
    );
}

export default withRouter(ProfilePage);