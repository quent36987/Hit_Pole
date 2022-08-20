import React, { useEffect, useState } from 'react';
import '../allPage.css';
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { RouteComponentProps } from 'react-router-dom';
import IPage from '../../interfaces/page';
import { Item, ItemConverter } from '../../data/Item';
import { db } from '../../firebase';
import { DateFormat } from '../../Utils/utils';
import { User, UserConverter } from '../../data/User';

const ParticipPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [jour,setJour] = useState<Date>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [selected, setSelected] = useState(0);
    const [users, setusers] = useState<User[]>([]);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [update, setUpdate] = useState(true);
    
    useEffect(() => {
        if (items.length > 0 ) {
            console.log("items sleect", items[selected].participation);
            setUserSelected(items[selected].participation);
            setUpdate(!update);
        }
    } ,[selected]);

    useEffect(() => {
        LoadData();
    } , [props.name])

    useEffect(() => {
        const collectionRef = collection(db, "Users").withConverter<User>(UserConverter);
        const queryRef = query(collectionRef);
        onSnapshot(queryRef, (snapshot) => {
            const list: User[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            console.log("users", list);
            setusers(list);
        });
    }, [props])

    async function LoadData() {
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        //datenow = 24 aout 2022
       // const datenow = new Date(2022, 7, 24);
       const datenow = new Date();
        console.log(datenow.toLocaleDateString())
        //get the item with date is today
        const data = await getDocs(query(collectionRef, 
            where("date", ">", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate()))),
            where("date","<", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 1)))));

            const list: Item[] = [];
            data.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            }
            );
            console.log("items", list);
            setItems(list);

    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        console.log(userSelected);
        const CaldendarDocRef = doc(db, 'calendrier', items[selected].id);
        updateDoc(CaldendarDocRef, { participation: userSelected })

    }

    return (<>
        page pour valider les présences, en version d'essai
        { items && items.length > 0 ?
        <div> 
            <select onChange={(e) => {
                setSelected(parseInt(e.target.value));
                console.log(selected);
            }
                }>
                {items.map((item, index) => <option key={index} value={index}>{DateFormat(item.date.toDate())}</option>)}
            </select>
                <div>
                    <form>
                        {items[selected].users.map((item, index) => 
                             ( <div key={index}>
                                        <input type="checkbox"

                                            checked={userSelected.includes(item)}
                                            
                                            onChange={(e) => {
                                               
                                               var list = userSelected;
                                                  if (e.target.checked) {
                                                        list.push(item);
                                                    } else {
                                                        list = list.filter(i => i !== item);
                                                    }
                                                setUserSelected(list);
                                                setUpdate(!update);

                                            }}
                                        ></input>
                                        {users.find(x => x.id === item)?.getFullName()}
                                </div>
                            ))
                        }
                    </form>
                    <button onClick={handleSubmit}>
                        Valider
                    </button>
                </div>
       </div> : null }
    </>)

}

export default ParticipPage;