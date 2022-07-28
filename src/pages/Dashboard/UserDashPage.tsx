import { collection, deleteDoc, doc, getDocs, increment, limit, onSnapshot, orderBy, query, startAfter, startAt, Timestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";
import logging from "../../config/logging";
import { AppState } from "../../Context";
import { Item, ItemConverter } from "../../data/Item";
import { User, UserConverter } from "../../data/User";
import { db } from "../../firebase";
import IPage from "../../interfaces/page";


const DashPage: React.FunctionComponent<IPage> = props => {

    const [data, setData] = useState<Item[]>([]);
    const [data_bis, setDataBis] = useState<Item[]>([]);
    const [key, setKey] = useState('users');
    const { setAlert } = AppState();
    const [users, setusers] = useState<User[]>([]);
    const [last, setlast] = useState(null);
    const [last_bis, setlastBis] = useState(null);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        logging.info(`Loading ${props.name}`);
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
        VoirPlus();
    }, [props])


    async function VoirPlus() {
       if (last) {
            console.log("last", last);
            const next = query(collection(db, "calendrier").withConverter<Item>(ItemConverter),
            orderBy("date"),
            where("date", ">", Timestamp.fromDate(new Date())),
            startAt(last),
            limit(15));
            await getDocs(next).then(snapshot => {
                const list = data;
                if (snapshot.size === 1) {
                    return;
                }
                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });
                setData(list);
                console.log("pub" , data);
                if(list.length > 0) {
                    setlast(list[list.length - 1].date);
                }
            });
        }
        else
        {
            const next = query(collection(db, "calendrier").withConverter<Item>(ItemConverter),
            orderBy("date"),
            where("date", ">", Timestamp.fromDate(new Date())),
            limit(15));

            await getDocs(next).then(snapshot => {
                const list :Item[] = [];
                snapshot.forEach((doc) => {
                    const exo = doc.data();
                    exo.id = doc.id;
                    list.push(exo);
                });
                setData(list);
                console.log("pub" , data);
                if (list.length > 0) {
                    setlast(list[list.length - 1].date);
                }
            });
        }
    }

    async function VoirPlus_bis() {
        if (last_bis) {
             console.log("last", last_bis);
             const next = query(collection(db, "calendrier").withConverter<Item>(ItemConverter),
             orderBy("date", "desc"),
             where("date", "<=", Timestamp.fromDate(new Date())),
             startAfter(last_bis),
             limit(10));
             await getDocs(next).then(snapshot => {
                 const list = data_bis;
                 if (snapshot.size === 1) {
                     return;
                 }
                 snapshot.forEach((doc) => {
                     const exo = doc.data();
                     exo.id = doc.id;
                     list.push(exo);
                 });
                 setDataBis(list);
                 console.log("pub" , list);
                 if(list.length > 0) {
                 setlastBis(list[list.length - 1].date);
                    }
             });
         }
         else
         {
             const next = query(collection(db, "calendrier").withConverter<Item>(ItemConverter),
             orderBy("date", "desc"),
             where("date", "<=", Timestamp.fromDate(new Date())),
             limit(10));
 
             await getDocs(next).then(snapshot => {
                 const list :Item[] = [];
                 snapshot.forEach((doc) => {
                     const exo = doc.data();
                     exo.id = doc.id;
                     list.push(exo);
                 });
                 setDataBis(list);
                 console.log("pub" , list);
                 if (list.length > 0) {
                     setlastBis(list[list.length - 1].date);
                 }
             });
         }
     }


    async function AddSolde(user : User, solde : number) {
        try {
            const UserDocRef = doc(db,'Users',user.id)
            await updateDoc(UserDocRef, {solde: increment(solde)})
        }
        catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: "error",
            });
        }
    }


    return (
        <>
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="users" title="Utilisateurs">
        
      <Table responsive>
                <thead>
                    <tr>
                        <th>Prenom</th>
                        <th>Nom</th>
                        <th>Solde</th>
                        <th>Modifier le solde</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.prenom}</td>
                            <td>{user.nom}</td>
                            <td>{user.solde}</td>
                            <td>
                            <Button onClick={() => AddSolde(user,1)} variant="success-outline">➕</Button>
                            <Button onClick={() => AddSolde(user,-1)} variant="success-outline">➖</Button>
                            <Button disabled variant="success-outline">✏️</Button>
                            </td>
                            <td>
                            <Button variant="success-outline">❔</Button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>

      </Tab>
      <Tab eventKey="cours" title="Cours">
        
      <Table responsive>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Nombre d'inscrit</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.titre}</td>
                            <td>{item.date.toDate().toLocaleDateString()}</td>
                            <td>{item.users.length} / {item.place}</td>
                            <td>{item.temps}</td>
                            <td>
                                <Button variant="success-outline">❔</Button>
                            </td>
                            <td>
                                <Button variant="success-outline"
                                href={"/modif/" + item.id} >✏️</Button>
                            </td>
                            <td>
                            <Button variant="outline-danger"
                            onClick={() => {
                                deleteDoc(doc(db, "calendrier", item.id)).then(() => {
                                    var list = data;
                                    list.splice(list.indexOf(item), 1);
                                    setData(list);
                                    if (list.length === 0) {
                                        setlast(null);
                                    }
                                    setUpdate(!update);
                                });
                            }}
                            >🗑️</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{"textAlign":"center"}} onClick={() => VoirPlus()}>
                voir plus.. 
            </div>
      </Tab>

      <Tab eventKey="cours passe" title="Cours passé">
        
      <Table responsive>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Date</th>
                        <th>Nombre d'inscrit</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    {data_bis.map((item) => (
                        <tr key={item.id}>
                            <td>{item.titre}</td>
                            <td>{item.date.toDate().toLocaleDateString()}</td>
                            <td>{item.users.length} / {item.place}</td>
                            <td>{item.temps}</td>
                            <td>
                                <Button variant="success-outline">❔</Button>
                            </td>
                            <td>
                                <Button variant="success-outline"
                                href={"/modif/" + item.id} >✏️</Button>
                            </td>
                            <td>
                            <Button variant="outline-danger"
                            onClick={() => {
                                deleteDoc(doc(db, "calendrier", item.id)).then(() => {
                                    var list = data_bis;
                                    list.splice(list.indexOf(item), 1);
                                    setDataBis(list);
                                    if (list.length === 0) {
                                        setlastBis(null);
                                    }
                                    setUpdate(!update);
                                });
                            }}
                            >🗑️</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{"textAlign":"center"}} onClick={() => VoirPlus_bis()}>
                voir plus.. 
            </div>
      </Tab>
      
    </Tabs>

        </>
    )

}

export default DashPage;