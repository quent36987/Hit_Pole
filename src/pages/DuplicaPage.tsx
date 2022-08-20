
import React, { useState } from 'react';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Item, ItemConverter } from '../data/Item';
import { Button, Form } from 'react-bootstrap';
import IPage from '../interfaces/page';
import './allPage.css';
import { db } from '../firebase';

const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const DuplicaPage: React.FunctionComponent<IPage> = props => {


    const [type, setType] = useState("");
    const [dateCP, setDateCP] = useState(0);
    const [dateCL, setDateCL] = useState([]);
    const [annee, setAnnee] = useState(new Date().getFullYear());

    function Option(annee : number) {
        var semaines = [];
        var datefirst = [];
        //get the first monday of the year
        var firstMonday = new Date(annee, 0, 1);
        while (firstMonday.getDay() !== 1) {
            firstMonday.setDate(firstMonday.getDate() + 1);
        }
        var decal = firstMonday.getDay() === 0 ? 6 : firstMonday.getDay() - 1;
        //return all weeks (monday to sunday) of the year with the format "DD/MM to DD/MM"
        for (var i = 0; i < 52; i++) {
            var date = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + decal + i * 7 );
            var date2 = new Date(firstMonday.getFullYear(), firstMonday.getMonth(), firstMonday.getDate() + decal + i * 7 + 6);
            semaines.push(date.toLocaleDateString() + " to " + date2.toLocaleDateString() + '  (' + mois[date.getMonth()] + ')');
            datefirst.push(date);
        }
        return {semaines, datefirst};
    }



    async function SubmitChange()
    {
        var dateweeks = Option(annee).datefirst;
        var datedebut = dateweeks[dateCP];
        //get all the events of the week (dateCP)
        const q = query(collection(db, "calendrier").withConverter(ItemConverter),
            orderBy("date"),
            where("date", ">=", Timestamp.fromDate(datedebut)),
            where("date", "<", Timestamp.fromDate(new Date(datedebut.getFullYear(), datedebut.getMonth(), datedebut.getDate() + 7))));

        const querySnapshot = await getDocs(q);
        const list: Item[] = [];
        querySnapshot.forEach((doc) => {
            const exo = doc.data();
            exo.id = doc.id;
            list.push(exo);
        });
        console.log("list :",list);


        var listnewdate = [];
        dateCL.forEach(function (date) {
            listnewdate.push(dateweeks[date]);
        });
        console.log("listnewdate :",listnewdate);

        //create a new event for each event of the week

        for(var c = 0; c < list.length; c++)
        {
            for (var d = 0; d < listnewdate.length; d++) {
                const date = new Date(listnewdate[d].getFullYear(),
                listnewdate[d].getMonth(),
                list[c].date.toDate().getDay() === 0 ? 
                listnewdate[d].getDate() +  6 : 
                listnewdate[d].getDate() +  list[c].date.toDate().getDay() -1,
                list[c].date.toDate().getHours(),
                list[c].date.toDate().getMinutes());
                
                var item = list[c];
                item.date = Timestamp.fromDate(date);
                item.users = [];

                console.log(item);
                const collectionRef = collection(db, "calendrier").withConverter(ItemConverter);
                await addDoc(collectionRef, item).catch(error => {
                    console.log(error);
                });
            }
        }
        //refesh the page
        window.location.reload();
    }

    

    return (
        <div className='DuplicaPage'>
            <h1 className='Titre' >Duplication de planning</h1>

                <Form>
                   <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">Type de duplication</option>
                        <option value="CP">Duplication de Jours</option>
                        <option value="CL">Duplication de Semaine</option>
                    </Form.Select>
                    
                    <Form.Select value={annee} onChange={(e) => setAnnee(Number(e.target.value))}>
                        {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map((annee) => (
                            <option key={annee} value={annee}>{annee}</option>
                        ))}
                    </Form.Select>
                        
                    <Form.Select value={dateCP} onChange={(e) => setDateCP(Number(e.target.value))}>
                        {Option(annee).semaines.map((item, index) => {
                            return <option key={index} value={index}>{item}</option>
                        })}
                    </Form.Select>
                    <Form.Group>
                        {Option(annee).semaines.map((item, index) => {
                            return <Form.Check key={index} type="checkbox" label={item} 
                            onChange={(e) => {console.log(e.target.checked);
                            if(e.target.checked)
                            {
                                var datecl = dateCL;
                                datecl.push(index);
                                setDateCL(datecl);
                            }
                            else
                            {
                                var datecl = dateCL;
                                var index2 = datecl.indexOf(index);
                                datecl.splice(index2, 1);
                                setDateCL(datecl);
                            }
                            }}/>
                        })
                        }
                    </Form.Group>
                    <Button variant="primary" onClick={() => SubmitChange()}>
                        Submit
                    </Button>

                </Form>

        </div>
    )
}

export default DuplicaPage;

