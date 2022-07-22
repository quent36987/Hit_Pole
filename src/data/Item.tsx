import { Timestamp } from "firebase/firestore";
import { Button, Card } from "react-bootstrap";
import { DateFormat, Reserver } from '../Utils/utils';

export enum TYPE_COURS
{
    COURS,
    INITIATION,
    STAGE,
    PRACTICE,
}

export class Item {

    public type : TYPE_COURS; 
    public titre: string;
    public desc: string;
    public date: Timestamp;
    public temps: number;
    public place: number;
    public id: string;
    public users: string[] = [];

    constructor(titre: string, desc: string, date: Timestamp,
       temps: number, place: number, id:    string,
        users: string[], type : TYPE_COURS) {
        this.titre = titre;
        this.desc = desc;
        this.date = date;
        this.temps = temps;
        this.place = place;
        this.id = id;
        this.users = users;
        this.type = type;

        this.users = users ? users : [];
    }

    WithHeaderExample(user, setAlert) {
        return (
          <Card style={{"marginBottom" : "1vh", "width":"100%"}}>
            <Card.Header style={{"display":"flex", "justifyContent":"space-between"}}>
            < div > {DateFormat(this.date.toDate())}</div>
                <div >{this.temps} h</div>
                </Card.Header>
            <Card.Body>
              <Card.Title>{this.titre}</Card.Title>
              <Card.Text>
                {this.desc}
              </Card.Text>
              {user && this.users  && this.users.includes(user.uid) ?
              <Button variant="outline-danger" style={{"marginRight":"10px"}}
                onClick={() => {
                    setAlert({
                        open: true,
                        type: "error",
                        message: "Annulation impossible pour le moment"
                    });
                }}>Annuler</Button>
                :
                <Button variant="outline-success" style={{"marginRight":"10px"}}
                onClick={() => Reserver(this,setAlert,user)}>Réserver !</Button>
                
              }
                il reste {this.place - this.users.length} places sur {this.place}.
            </Card.Body>
          </Card>
        );
      }

}

export const ItemConverter = 
{
    toFirestore: function (item: Item) {
        return {
            titre: item.titre,
            desc: item.desc,
            date: item.date,
            temps: item.temps,
            place: item.place,
            id: item.id,
            users: item.users,
            type : item.type,
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);
        return new Item(item.titre, item.desc, item.date, 
          item.temps, item.place, item.id, item.users,item.type);
    }
};