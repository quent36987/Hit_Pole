import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import './allPage.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { collection, limit, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Item, ItemConverter } from '../data/Item';


const HomePage: React.FunctionComponent<IPage> = props => {
    const [data, setData] = useState([]);


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


    function DateFormat(date : Date) {
        // format : dd/mm à hh:mm
        let day = date.getDate();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let str = day + "/" + month + " à " + hour + ":" + minute;
        return str;
    }



    function WithHeaderExample(item : Item) {

        return (
          <Card style={{"marginBottom" : "1vh", "width":"100%"}}>
            <Card.Header style={{"display":"flex", "justifyContent":"space-between"}}>
            < div > {DateFormat(item.date.toDate())}</div>
                <div >{item.temps} h</div>
                </Card.Header>
            <Card.Body>
              <Card.Title>{item.titre}</Card.Title>
              <Card.Text>
                {item.desc}
              </Card.Text>
              <Button variant="outline-success" style={{"marginRight":"10px"}}>Réserver !</Button>
                il reste 3 places sur {item.place}.
            </Card.Body>
          </Card>
        );
      }


    return (
        <div className='HomePage'>
            <h1 className='Titre' >Futur évenements à venir:</h1>

                <div className="HomePage-content">
                    {data.map((data) => (
                        WithHeaderExample(data)
                    ))}
                    
                    

                </div>
        </div>
    )
}

export default HomePage;
