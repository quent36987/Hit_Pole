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
        const queryRef = query(collectionRef,orderBy("date"),limit(2),where("date", ">", Timestamp.fromDate(new Date())));
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




    function WithHeaderExample(item : Item) {

        return (
          <Card style={{"marginBottom" : "1vh", "width":"100%"}}>
            <Card.Header>{item.date.toDate().toUTCString()}</Card.Header>
            <Card.Body>
              <Card.Title>{item.titre}</Card.Title>
              <Card.Text>
                {item.desc}
              </Card.Text>
              <Button variant="primary">Réserver !</Button>
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
