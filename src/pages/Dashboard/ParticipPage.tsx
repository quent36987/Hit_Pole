import React, { useEffect, useState } from 'react';
import '../allPage.css';
import { Button, Col, Dropdown, DropdownButton, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { RouteComponentProps } from 'react-router-dom';
import IPage from '../../interfaces/page';
import { Item, ItemConverter } from '../../data/Item';
import { db } from '../../firebase';
import { DateFormat } from '../../Utils/utils';
import { User, UserConverter } from '../../data/User';
import { AppState } from '../../Context';

const ParticipPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

    const [jour,setJour] = useState<Date>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [selected, setSelected] = useState(0);
    const [users, setusers] = useState<User[]>([]);
    const [userSelected, setUserSelected] = useState<string[]>([]);
    const [update, setUpdate] = useState(true);
    const [userAdd, setUserAdd] = useState(null);
    
    const[load,setLoad] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { setAlert } = AppState();

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
        const list: Item[] = [];
       if (props.match.params.id == '0') {
            //const datenow = new Date(2022, 7, 24);
            const datenow = new Date();
            //get the item with date is today
            const data = await getDocs(query(collectionRef, 
                where("date", ">", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate()))),
                where("date","<", Timestamp.fromDate(new Date(datenow.getFullYear(), datenow.getMonth(), datenow.getDate() + 1)))));

            data.forEach((doc) => {
                const exo = doc.data();
                exo.id = doc.id;
                list.push(exo);
            }
            );
            
       }
       else{
            const query = doc(db, "calendrier", props.match.params.id).withConverter(ItemConverter);
            const docsnap = await getDoc(query);
            const exo = docsnap.data();
            exo.id = docsnap.id;
            list.push(exo);

       }
       console.log("items", list);
       setItems(list);
       if (list.length > 0 && selected < list.length) {
            setUserSelected(list[selected].participation);
       }
       setUpdate(!update);
       setLoad(true);
        
    }



    const addPartcipant = async (event, id: string) => {
        event.preventDefault();
        event.stopPropagation();

        if (userAdd == null || items[selected].users.includes(id)) {
            setAlert({
                open: true,
                message: `error`,
                type: "error",
            });
            return;
        }

        const CaldendarDocRef1 = doc(db, 'calendrier', items[selected].id);
        updateDoc(CaldendarDocRef1, { users: arrayUnion(id) });

        var usersSelect = userSelected;
        usersSelect.push(id);
        const CaldendarDocRef = doc(db, 'calendrier', items[selected].id);
        updateDoc(CaldendarDocRef, { participation: usersSelect })
            .then(() => {
                setAlert({
                    open: true,
                    message: `Modification effectuée`,
                    type: "success",
                });
            }).catch((error) => {
                setAlert({
                    open: true,
                    message: `Erreur lors de la modification`,
                    type: "error",
                });
            }
        );
        LoadData();
    }

    const handleSubmit = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        console.log(userSelected);



        const CaldendarDocRef = doc(db, 'calendrier', items[selected].id);
        updateDoc(CaldendarDocRef, { participation: userSelected })
            .then(() => {
                setAlert({
                    open: true,
                    message: `Modification effectuée`,
                    type: "success",
                });
            }).catch((error) => {
                setAlert({
                    open: true,
                    message: `Erreur lors de la modification`,
                    type: "error",
                });
            }
        );




    }

    return (<>
        page pour valider les présences, en version d'essai
        {load && items && items.length > 0 ?
        <div> 
            <select 
            style={{height:"50px",fontSize:"20px",marginBottom:"20px",borderRadius:"5px",border:"1px solid #ccc",backgroundColor:"#fff",color:"#000",margin:"20px",width:"85vw"}}
            onChange={(e) => {
                setSelected(parseInt(e.target.value));
                console.log(selected);
            }
                }>
                {items.map((item, index) => <option key={index} value={index}>{DateFormat(item.date.toDate())}</option>)}
            </select>
                <div>
                    <form>
                        {items[selected].users.map((item, index) => 
                            
                             ( <div key={index}
                                style={{height:"35px", fontSize:"25px",marginBottom:"5px",overflow:'hidden'}}>
                             
                                        <input type="checkbox"
                                            style={{marginRight:"10px",marginLeft:"10px",width:"20px",height:"20px"}}
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
                                            checked={userSelected.includes(item)}
                                        ></input>
                                        {users.find(x => x.id === item)?.getFullName()}
                                </div>
                            ))
                        }
                    </form>

                    <button 
                    style={{height:"50px",fontSize:"20px",marginBottom:"20px",borderRadius:"5px",border:"1px solid #ccc",color:"#000",width:"85vw",marginRight:"20px",marginLeft:"20px",marginTop:"20px"}}
                    onClick={handleShow}>
                        Ajouter un participant
                    </button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Ajouter un participant</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <select style={{height:"50px",fontSize:"20px",marginBottom:"20px",borderRadius:"5px",border:"1px solid #ccc",backgroundColor:"#fff",color:"#000",margin:"20px",width:"85vw"}}
                                    onChange={(e) => {
                                        setUserAdd(e.target.value);
                                    }
                                        }>
                                    {users.map((item, index) => <option key={index} value={item.id}>{item.getFullName()}</option>)}
                                </select>
                            </form>
                            <button style={{height:"50px",fontSize:"20px",marginBottom:"20px",borderRadius:"5px",border:"1px solid #ccc",color:"#000",width:"85vw",marginRight:"20px",marginLeft:"20px",marginTop:"20px"}}
                                onClick={(e) => {
                                    addPartcipant(e, userAdd);
                                    handleClose();
                                }
                                }>
                                Ajouter
                            </button>


                        </Modal.Body>
                        
                    </Modal>

                    <button 
                    style={{height:"50px",fontSize:"20px",marginBottom:"20px",borderRadius:"5px",border:"1px solid #ccc",backgroundColor:"#84CA40",color:"#000",margin:"20px",width:"85vw"}}
                    onClick={handleSubmit}>
                        Valider
                    </button>

                   
                </div>
       </div> : null }
    </>)

}

export default ParticipPage;