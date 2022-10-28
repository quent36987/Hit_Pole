import './allPage.css';
import { db } from '../firebase';
import { IPage } from '../interfaces/page';
import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Button, Form } from 'react-bootstrap';
import { Item, ItemConverter } from '../data/Item';
import React, { useState } from 'react';

const mois = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

const DuplicaPage: React.FunctionComponent<IPage> = (props) => {
    const [type, setType] = useState('');
    const [dateCP, setDateCP] = useState(0);
    const [dateCL, setDateCL] = useState([]);
    const [annee, setAnnee] = useState(new Date().getFullYear());

    function option(annee: number): { semaines: string[]; datefirst: Date[] } {
        const semaines = [];
        const datefirst = [];
        // get the first monday of the year
        const firstMonday = new Date(annee, 0, 1);

        while (firstMonday.getDay() !== 1) {
            firstMonday.setDate(firstMonday.getDate() + 1);
        }

        const decal = firstMonday.getDay() === 0 ? 6 : firstMonday.getDay() - 1;

        // return all weeks (monday to sunday) of the year with the format "DD/MM to DD/MM"
        for (let i = 0; i < 52; i++) {
            const date = new Date(
                firstMonday.getFullYear(),
                firstMonday.getMonth(),
                firstMonday.getDate() + decal + i * 7
            );

            const date2 = new Date(
                firstMonday.getFullYear(),
                firstMonday.getMonth(),
                firstMonday.getDate() + decal + i * 7 + 6
            );

            semaines.push(
                date.toLocaleDateString() +
                    ' to ' +
                    date2.toLocaleDateString() +
                    '  (' +
                    mois[date.getMonth()] +
                    ')'
            );

            datefirst.push(date);
        }

        return { semaines, datefirst };
    }

    async function submitChange(): Promise<void> {
        const dateweeks = option(annee).datefirst;
        const datedebut = dateweeks[dateCP];

        // get all the events of the week (dateCP)
        const q = query(
            collection(db, 'calendrier').withConverter(ItemConverter),
            orderBy('date'),
            where('date', '>=', Timestamp.fromDate(datedebut)),
            where(
                'date',
                '<',
                Timestamp.fromDate(
                    new Date(datedebut.getFullYear(), datedebut.getMonth(), datedebut.getDate() + 7)
                )
            )
        );

        const querySnapshot = await getDocs(q);
        const list: Item[] = [];

        querySnapshot.forEach((doc) => {
            const exo = doc.data();
            exo.id = doc.id;
            list.push(exo);
        });

        const listnewdate = [];

        dateCL.forEach(function (date) {
            listnewdate.push(dateweeks[date]);
        });

        // create a new event for each event of the week
        for (let c = 0; c < list.length; c++) {
            for (let d = 0; d < listnewdate.length; d++) {
                const date = new Date(
                    listnewdate[d].getFullYear(),
                    listnewdate[d].getMonth(),
                    list[c].date.toDate().getDay() === 0
                        ? 6 + Number(listnewdate[d].getDate())
                        : Number(list[c].date.toDate().getDay()) +
                          Number(listnewdate[d].getDate()) -
                          1,
                    list[c].date.toDate().getHours(),
                    list[c].date.toDate().getMinutes()
                );

                const item = list[c];
                item.date = Timestamp.fromDate(date);
                item.users = [];

                const collectionRef = collection(db, 'calendrier').withConverter(ItemConverter);

                await addDoc(collectionRef, item).catch(console.error);
            }
        }

        // refesh the page
        window.location.reload();
    }

    return (
        <div className="DuplicaPage">
            <h1 className="Titre">Duplication de planning</h1>

            <Form>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Type de duplication</option>
                    <option value="CP">Duplication de Jours</option>
                    <option value="CL">Duplication de Semaine</option>
                </Form.Select>

                <Form.Select value={annee} onChange={(e) => setAnnee(Number(e.target.value))}>
                    {[
                        new Date().getFullYear() - 1,
                        new Date().getFullYear(),
                        new Date().getFullYear() + 1
                    ].map((annee) => (
                        <option key={annee} value={annee}>
                            {annee}
                        </option>
                    ))}
                </Form.Select>

                <Form.Select value={dateCP} onChange={(e) => setDateCP(Number(e.target.value))}>
                    {option(annee).semaines.map((item, index) => {
                        return (
                            <option key={index} value={index}>
                                {item}
                            </option>
                        );
                    })}
                </Form.Select>
                <Form.Group>
                    {option(annee).semaines.map((item, index) => {
                        return (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                label={item}
                                onChange={(e) => {
                                    const datecl = dateCL;

                                    if (e.target.checked) {
                                        datecl.push(index);
                                        setDateCL(datecl);
                                    } else {
                                        const index2 = datecl.indexOf(index);
                                        datecl.splice(index2, 1);
                                        setDateCL(datecl);
                                    }
                                }}
                            />
                        );
                    })}
                </Form.Group>
                <Button variant="primary" onClick={async () => await submitChange()}>
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export { DuplicaPage };
