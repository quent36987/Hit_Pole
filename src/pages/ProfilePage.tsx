import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './allPage.css';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, Timestamp, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { AppState } from '../Context';
import { db } from '../firebase';
import { Button, Spinner } from 'react-bootstrap';
import { User, UserConverter } from '../data/User';



const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [data, setData] = useState([]);
    const [dataUser, setdataUser] = useState<User>(null);
    const { user, setAlert } = AppState();
    const [last, setlast] = useState(null);
    const [update, setUpdate] = useState(true);


    async function LoadItem() {
        var limi = 10;
        if (last) {
             console.log("last", last);
             const q = query(collection(db, "calendrier").withConverter(ItemConverter),
             where('users', 'array-contains', user.uid),
             where("date", ">", Timestamp.fromDate(new Date())),
             orderBy("date"),
             startAfter(last), 
             limit(limi));
            const querySnapshot = await getDocs(q);
            setUpdate(false);
            const list = data;
            if (querySnapshot.size === 0) {
                setlast(null);
                return;
            }
            querySnapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setData(list);
            console.log("pub", data);
             if (list.length > 0) {
                 setlast(list[list.length - 1].date);
             }
             if (querySnapshot.size < limi) {
                setlast(null);
            }

         }
         else
         {
            const q = query(collection(db, "calendrier").withConverter(ItemConverter),
            where('users', 'array-contains', user.uid),
            where("date", ">", Timestamp.fromDate(new Date())),
            orderBy("date"), 
            limit(limi));
           const querySnapshot = await getDocs(q);
        setUpdate(false);
           const list: Item[] = [];
           querySnapshot.forEach((doc) => {
               const exo = doc.data();
               exo.id = doc.id;
               list.push(exo);
           });
           setData(list);
           console.log("pub", data);
            if (list.length > 0) {
                setlast(list[list.length - 1].date);
            }
            if (querySnapshot.size < limi) {
                setlast(null);
            }
             
         }
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
            <h1 className='Titre' >{dataUser?.genre === "Homme" ? 'Profil 👨' : 'Profil 👩'}</h1>
            {user && dataUser ?
            <div className="HomePage-content">
                <div style={{"marginBottom" : "15px"}}>
                    Bonjour {dataUser.prenom}, il te reste {dataUser.solde} unité(s) sur ton compte.
                </div>
                Mes prochains cours réservés:
                {data.length  === 0 && update ? 
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                :
                    <>{data.map((data) => (
                        data.WithHeaderExample(user, setAlert,LoadItem)
                    ))}</>
                }
                {last !== null ? 
                <div style={{"textAlign":"center"}} onClick={() => LoadItem()}>
                voir plus.. 
                </div> : null}
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