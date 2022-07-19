import { collection, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { AppState } from '../Context';
import { Item, ItemConverter } from '../data/Item';
import { db } from '../firebase';
import IPage from '../interfaces/page';
import { DateFormat } from '../Utils/utils';
import './allPage.css';



const CalendrierPage: React.FunctionComponent<IPage> = props => {
    const { user, setAlert, perm } = AppState();
    const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const [datenow, setDatenow] = useState(new Date());
    const [data, setData] = useState([]);
    const [type, setType] = useState("mois"); // mois,semaine,jour

    useEffect(() => {
        console.log(datenow.toLocaleDateString());
        console.log(datenow.toLocaleTimeString());
    }, [datenow])

    useEffect(() => {
      
        const collectionRef = collection(db, "calendrier").withConverter<Item>(ItemConverter);
        //juste this month
        const queryRef = query(collectionRef,orderBy("date"),
        where("date", ">", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), 1))),
        where("date", "<", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth() + 1, 1))));
        onSnapshot(queryRef, (snapshot) => {
            const list: Item[] = [];
            snapshot.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            });
            setData(list);
            console.log("pub" , list);
        });
    }, [datenow.getMonth()])
    
  

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
                       return  <div className="calendar-table__item_2">{date.getDate()}</div>;
                    }
                    return ( <div className="calendar-table__item"  
                                onClick={() => { setDatenow(date); setType("jour"); } } >{date.getDate()}
                               {data.filter(item => item.date.toDate().getDate() === date.getDate()).map(item => {
                                     return <div className='calendar-table__item_item'>{item.titre}</div>
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
            <div style={{"textAlign":"center"}}>
                <h1 className='Titre' > Calendrier 📅</h1>
            </div>
        
            <div>
                <div>
                    <div className="calendar-container__body">
                        <div style={{"display": "flex", "justifyContent":"center"}}>
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
                                {"<"}</div>
                            <div className="calendar_header_item">{mois[datenow.getMonth()]}</div>
                            <div className="calendar_header_item"
                            onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth() + 1, 1))}>
                                {">"}</div>
                        </div>
                        <div  className="calendar-table__header">
                                <div className="calendar-table__col">M</div>
                                <div className="calendar-table__col">T</div>
                                <div className="calendar-table__col">W</div>
                                <div className="calendar-table__col">T</div>
                                <div className="calendar-table__col">F</div>
                                <div className="calendar-table__col">S</div>
                                <div className="calendar-table__col">S</div>
                        </div>
                        <div className="calendar-table">
                            { Calendar(datenow) }
                        </div>
                       </> : null}


                        {type === "jour" ? <>
                        <div className="calendar_header">
                            <div className="calendar_header_item" 
                            onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth() , datenow.getDate() - 1))}>
                                {"<"}</div>
                            <div className="calendar_header_item">{datenow.toLocaleDateString()}</div>
                            <div className="calendar_header_item"
                            onClick={() => setDatenow(new Date(datenow.getFullYear(), datenow.getMonth() , datenow.getDate() + 1))}>
                                {">"}</div>
                        </div>
                        <div className="HomePage-content">
                            {data.filter(item => item.date.toDate().getDate() === datenow.getDate()).map(item => {
                                return item.WithHeaderExample(user,setAlert)
                            })}
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