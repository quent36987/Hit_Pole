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
import { getUserName } from '../Utils/utils';




const ProfilePage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [data, setData] = useState([]);
    const { user, setAlert,profil } = AppState();
    const [last, setlast] = useState(null);
    const [update, setUpdate] = useState(true);


    async function LoadItem() {        
        var limi = 10;
        if (last) {
             const q = query(collection(db, "calendrier").withConverter(ItemConverter),
             where('users', 'array-contains-any', [user.uid, ...profil.famille]),
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
            where('users', 'array-contains-any', [user.uid, ...profil.famille]),
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
            if (list.length > 0) {
                setlast(list[list.length - 1].date);
            }
            if (querySnapshot.size < limi) {
                setlast(null);
            }

         }
     }


    const family = (elt : Item) => {
       let list = [];
       for (let index = 0; index < elt.users.length; index++) {
           const element = elt.users[index];
           if (element === user.uid) {
                
             
               list.push(getUserName([profil], element));
           }
           else if (profil.famille.includes(getUserName([profil], element))) {
               list.push(getUserName([], getUserName([profil], element)));
           }
       } 
       return ( <div>Reserver par :{list.map((elt)=> (
                    <div>{elt}</div>
                ))}
            </div>)
       
    }


    useEffect(() => {
        if (user && profil) {
            LoadItem();
        }
    }, [user, profil])


    return (
        <div className="container" style={{"textAlign":"center", "marginTop" : "5px"}}>
            <h1 className='Titre' >{profil?.genre === "Homme" ? 'Profil 👨' : 'Profil 👩'}</h1>
            {user && profil ?
            <div className="HomePage-content">
                <div style={{"marginBottom" : "15px"}}>
                    Bonjour {profil.prenom},
                </div>
                Mes prochains cours réservés:
                {data.length  === 0 && update ?
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                :
                    <>{data.map((elt) => ( <>
                        {profil.famille.length > 0 && family(elt)
                        }
                        {elt.WithHeaderExample(user,LoadItem)}
                        </>
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
