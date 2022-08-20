import { collection, onSnapshot, orderBy, query, Timestamp, where,doc, updateDoc, increment, arrayRemove } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AppState } from '../Context';
import { Item, ItemConverter } from '../data/Item';
import { db } from '../firebase';
import IPage from '../interfaces/page';
import { Reserver } from '../Utils/utils';
import './allPage.css';



const CalendrierPage: React.FunctionComponent<IPage> = props => {
    const { user, setAlert } = AppState();
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    const jours_semaine = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
    const [datenow, setDatenow] = useState(new Date());
    const [datenow_firstweek, setDatenow_firstweek] = useState(new Date());
    const [data, setData] = useState<Item[]>([]);
    const [type, setType] = useState("mois"); // mois,semaine,jour


    useEffect(() => {
        if (datenow.getDay() !== 1) {
            setDatenow_firstweek(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() - datenow.getDay() + 1));
        }
        else {
            setDatenow_firstweek(datenow)
        }
    }, [datenow])

    useEffect(() => {
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        //juste this month
        const queryRef = query(collectionRef, orderBy("date"),
            where("date", ">", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), 1))),
            where("date", "<", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth() + 1, 7))));
        onSnapshot(queryRef, (snapshot) => {
            const list: Item[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setData(list);
            console.log("pub", list);
        });
    }, [datenow.getMonth()])


    function Datehelp(date: Date) {
        //return DD/MM
        return date.getDate() + "/" + (date.getMonth() + 1);
    }

    function getweek(date: Date): Date[] {
        var week = [];
        for (var i = 0; i < 7; i++) {
            week.push(new Date(date.getFullYear(), date.getMonth(), date.getDate() + i));
        }
        return week;
    }


    function Calendar(datenow: Date) {
        const firstDay = (new Date(datenow.getFullYear(), datenow.getMonth(), 1).getDay() - 1) % 7 - 1;
        console.log("firstDay", firstDay);
        //create a table with the number of days of the month
        const table = [];

        table.push(

        )

        for (let i = 0; i < 6; i++) {
            table.push(
                [0, 1, 2, 3, 4, 5, 6].map(j => {
                    const date = new Date(datenow.getFullYear(), datenow.getMonth(), i * 7 + j - firstDay);
                    if (date.getMonth() !== datenow.getMonth()) {
                        return <div className="calendar-table__item_2"

                        >{date.getDate()}</div>;
                    }
                    return (<div className="calendar-table__item"
                        onClick={() => { setDatenow(date); setType("jour"); }}
                        style={{
                            'backgroundColor': date.getDate() === new Date().getDate() &&
                                date.getMonth() === new Date().getMonth() ? '#77777749' : ''
                        }}
                    >{date.getDate()}
                        {data.filter(item => item.date.toDate().getDate() === date.getDate() && item.date.toDate().getMonth() === date.getMonth()).map(item => {
                            return <div
                                className={user && item.users.includes(user.uid) ? 'calendar-table__item_item' : 'calendar-table__item_item2'}
                            >{item.titre}</div>
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
            <div style={{ "textAlign": "center" }}>
                <h1 className='Titre' > Calendrier 📅</h1>
            </div>

            <div>
                <div>
                    <div className="calendar-container__body">
                        <div style={{ "display": "flex", "justifyContent": "center" }}>
                            <div className={type === 'mois' ? 'calendar-type-choix' : 'calendar-type'}
                                onClick={() => setType("mois")}>Mois</div>
                            <div className={type === 'semaine' ? 'calendar-type-choix' : 'calendar-type'}
                                onClick={() => setType("semaine")}>Semaine</div>
                            <div className={type === 'jour' ? 'calendar-type-choix' : 'calendar-type'}
                                onClick={() => setType("jour")}>Jour</div>
                        </div>

                        {type === "mois" ? <>
                            <div className="calendar_header">
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth() - 1, 1))}>
                                    {"◀️"}</div>
                                <div className="calendar_header_item_centre">{mois[datenow.getMonth()]}</div>
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth() + 1, 1))}>
                                    {"▶️"}</div>
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
                            <div className="calendar-table">
                                {Calendar(datenow)}
                            </div>
                        </> : null}


                        {type === "semaine" ? <>
                            <div className="calendar_header">
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() - 7))}>
                                    {"◀️"}</div>
                                <div className="calendar_header_item_centre">{Datehelp(datenow_firstweek)} - {Datehelp(new Date(datenow_firstweek.getFullYear(), datenow_firstweek.getMonth(), datenow_firstweek.getDate() + 6))}</div>
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 7))}>
                                    {"▶️"}</div>
                            </div>
                            <div className='semaine'>

                                {getweek(datenow_firstweek).map(item => (
                                    <>
                                        <div className='jour'>{jours_semaine[item.getDay()]}, {item.getDate()} {mois[item.getMonth()]}</div>
                                        {data.filter(item2 => item2.date.toDate().getDate() === item.getDate() && item2.date.toDate().getMonth() === item.getMonth()).map(item2 => (
                                            <div className='carte'>
                                                <div className='carte-info' >
                                                    <div className='carte-info-1'>
                                                        <div className='carte-info-heure' >{item2.getHour()}</div>
                                                        <div className='carte-info-titre' >{item2.titre} - {item2.niveau}</div>
                                                        <div className='carte-info-plus'>{item2.place - item2.users.length }/{item2.place} {"place(s) dispo"}</div>
                                                    </div>
                                                    <span className='carte-info-2' >


                                                        {item2.date < Timestamp.fromDate(new Date()) ?
                                                            <div>
                                                                Ce cours est passé.
                                                            </div>
                                                            :
                                                            <>
                                                                {user && item2.users && item2.users.includes(user.uid) ?
                                                                    <Button variant="outline-danger" style={{ "marginRight": "10px", "fontSize": "12px" }}
                                                                        onClick={async () => {
                                                                            //if the date is less than 24h before now, the cancel is forbiden
                                                                            if(item2.date.toDate() < new Date(new Date().getTime() + (24 * 60 * 60 * 1000))) {
                                                                                setAlert({
                                                                                    open: true,
                                                                                    type: "error",
                                                                                    message: "Vous ne pouvez pas annuler un cours qui est dans moins de 24h"
                                                                                    });
                                                                                return;
                                                                            } 

                                                                            if (window.confirm('Voulez-vous vraiment annuler ce cours ?')) {
                                                                                //remove the user from the item2.users and update on firestore
                                                                                const CaldendarDocRef = doc(db, 'calendrier', item2.id);
                                                                                const UserDocRef = doc(db,'Users',user.uid)
                                                                                try{
                                                                                await Promise.all(
                                                                                    [updateDoc(CaldendarDocRef, { users: arrayRemove(user.uid) }),
                                                                                    updateDoc(UserDocRef, {solde: increment(item2.unite)})])
                                                                                
                                                                                }
                                                                                catch(error){
                                                                                    setAlert({
                                                                                    open: true,
                                                                                    type: "error",
                                                                                    message: "Une error est survenue, veuillez réessayer ultérieurement."
                                                                                    });
                                                                                }
                                                                            }
                                                                            
                                                                        }}>Annuler la réservation</Button>
                                                                    :
                                                                    <>

                                                                        {item2.place - item2.users.length <= 0 ?
                                                                            "Complet"
                                                                            :
                                                                            <div className='header'> <Button variant="outline-success" style={{ "marginRight": "10px" }} className="header"
                                                                                onClick={() => Reserver(item2, setAlert, user)}>Réserver</Button>

                                                                            </div>
                                                                        }</>


                                                                }
                                                            </>
                                                        }

                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </>))}
                            </div>
                        </> : null}



                        {type === "jour" ? <>
                            <div className="calendar_header">
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() - 1))}>
                                    {"◀️"}</div>
                                <div className="calendar_header_item_centre">{datenow.toLocaleDateString()}</div>
                                <div className="calendar_header_item"
                                    onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 1))}>
                                    {"▶️"}</div>
                            </div>

                            <div className='semaine'>
                                <div className='jour'>{jours_semaine[datenow.getDay()]}, {datenow.getDate()} {mois[datenow.getMonth()]}</div>
                                {data.filter(item => item.date.toDate().getDate() === datenow.getDate() && item.date.toDate().getMonth() === datenow.getMonth()).map(item2 => (


                                    <div className='carte'>
                                        <div className='carte-info' >
                                            <div className='carte-info-1'>
                                                <div className='carte-info-heure' >{item2.getHour()}</div>
                                                <div className='carte-info-titre' >{item2.titre} - {item2.niveau}</div>
                                                <div className='carte-info-plus'>{item2.place - item2.users.length }/{item2.place} {"place(s) dispo"}</div>
                                            </div>
                                            <span className='carte-info-2' >


                                                {item2.date < Timestamp.fromDate(new Date()) ?
                                                    <div>
                                                        Ce cours est passé.
                                                    </div>
                                                    :
                                                    <>
                                                        {user && item2.users && item2.users.includes(user.uid) ?
                                                            <Button variant="outline-danger" style={{ "marginRight": "10px", "fontSize": "12px" }}
                                                            onClick={async () => {
                                                                //if the date is less than 24h before now, the cancel is forbiden
                                                                if(item2.date.toDate() < new Date(new Date().getTime() + (24 * 60 * 60 * 1000))) {
                                                                    setAlert({
                                                                        open: true,
                                                                        type: "error",
                                                                        message: "Vous ne pouvez pas annuler un cours qui est dans moins de 24h"
                                                                        });
                                                                    return;
                                                                } 

                                                                if (window.confirm('Voulez-vous vraiment annuler ce cours ?')) {
                                                                    //remove the user from the item2.users and update on firestore
                                                                    const CaldendarDocRef = doc(db, 'calendrier', item2.id);
                                                                    const UserDocRef = doc(db,'Users',user.uid)
                                                                    try{
                                                                    await Promise.all(
                                                                        [updateDoc(CaldendarDocRef, { users: arrayRemove(user.uid) }),
                                                                        updateDoc(UserDocRef, {solde: increment(item2.unite)})])
                                                                    
                                                                    }
                                                                    catch(error){
                                                                        setAlert({
                                                                        open: true,
                                                                        type: "error",
                                                                        message: "Une error est survenue, veuillez réessayer ultérieurement."
                                                                        });
                                                                    }
                                                                }
                                                                
                                                            }}>Annuler la réservation</Button>
                                                            :
                                                            <>

                                                                {item2.place - item2.users.length <= 0 ?
                                                                    "Complet"
                                                                    :
                                                                    <div className='header'> <Button variant="outline-success" style={{ "marginRight": "10px" }} className="header"
                                                                        onClick={() => Reserver(item2, setAlert, user)}>Réserver !</Button>

                                                                    </div>
                                                                }</>


                                                        }
                                                    </>
                                                }

                                            </span>
                                        </div>
                                    </div>



                                ))}




                                {data.filter(item => item.date.toDate().getDate() === datenow.getDate() && item.date.toDate().getMonth() === datenow.getMonth()).length === 0 ?
                                    <div>
                                        Aucun cours prévus ce {jours[datenow.getDay()]}
                                    </div>
                                    : null}
                            </div>
                        </>
                            : null}



                    </div>
                </div>
            </div>
        </div>
    )

}


export default CalendrierPage;