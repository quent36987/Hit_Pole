import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './allPage.css';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { AppState } from '../Context';
import { db } from '../firebase';
import { Button, Spinner } from 'react-bootstrap';
import { User, UserConverter } from '../data/User';



const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [data, setData] = useState([]);
    const [dataUser, setdataUser] = useState<User>(null);
    const { user, setAlert } = AppState();

    async function LoadItem() {
        console.log("e");
        const q = query(collection(db, "calendrier").withConverter(ItemConverter),
         where('users', 'array-contains', user.uid),
         where("date", ">", Timestamp.fromDate(new Date())),
         orderBy("date"), 
         limit(10));
        const querySnapshot = await getDocs(q);
        const list: Item[] = [];
        querySnapshot.forEach((doc) => {
            const exo = doc.data();
            exo.id = doc.id;
            list.push(exo);
        });
        setData(list);
        console.log("pub", data);
    }
    async function LoadProfile() {

        const query = doc(db,"Users",user.uid).withConverter(UserConverter);
        const docsnap = await getDoc(query);
        setdataUser(docsnap.data());
    }


    useEffect(() => {
        if (user) {
            LoadItem();
            LoadProfile();
        }
    }, [user])


    return (
        <div className="container" style={{"textAlign":"center", "marginTop" : "5px"}}>
            <h1 className='Titre' >{dataUser?.genre === "Homme" ? 'Profile 👨' : 'Profile 👩'}</h1>
            {user && dataUser ?
            <div className="HomePage-content">
                <div style={{"marginBottom" : "15px"}}>
                    Bonjour {dataUser.prenom}, il te reste {dataUser.solde} unité sur ton compte.
                </div>
                Mes prochains cours réservés:
                {data.length === 0 ? 
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