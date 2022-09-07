import { arrayRemove, doc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { Button, Card } from "react-bootstrap";
import { db } from "../firebase";
import { DateFormat, DateFormatAbv, DateTimeAbv, Reserver } from '../Utils/utils';

export const Titres = [
  'Pole',
  'Pole ados',
  'Hit Streching',
  'Chair et Exotic',
]
export const Niveaux = [
  'Tout niveau',
  'Initiation/débutant',
  'Deb 2/3',
  'Débutant/Inter 1',
  'Inter 1',
  'Inter 1/2',
  'Inter 2',
]


export enum TYPE_COURS {
  COURS,
  INITIATION,
  STAGE,
  PRACTICE,
}

export class Item {

  public type: TYPE_COURS;
  public titre: string;
  public desc: string;
  public date: Timestamp;
  public temps: number;
  public place: number;
  public id: string;
  public users: string[] = [];
  public unite: number;
  public niveau: string;
  public participation : string[] = [];

  constructor(titre: string, desc: string, date: Timestamp,
    temps: number, place: number, id: string,
    users: string[], type: TYPE_COURS, unite: number, niveau: string, participation : string[]) {
    this.titre = titre ? titre : "";
    this.desc = desc ? desc : "";
    this.date = date ? date : new Timestamp(0, 0);
    this.temps = temps ? temps : 0;
    this.place = place ? place : 0;
    this.id = id ? id : "";
    this.users = users ? users : [];
    this.type = type ? type : TYPE_COURS.COURS;
    this.unite = unite ? unite : 0;

    this.users = users ? users : [];
    this.niveau = niveau ? niveau : "";
    this.participation = participation ? participation : [];
  }

  
  public getHour(): string {
    //returun HH:MM - HH:MM
    var datefin = new Date(this.date.seconds * 1000 + this.temps * 60 * 1000);
    var dateDebut = new Date(this.date.seconds * 1000);

    return (dateDebut.getHours() < 10 ? "0" + dateDebut.getHours() : dateDebut.getHours())
     +":" +
      ( dateDebut.getMinutes() < 10 ? "0" + dateDebut.getMinutes() : dateDebut.getMinutes())
      +" - " + 
      (datefin.getHours() < 10 ? "0" + datefin.getHours() : datefin.getHours())
      +":" +
      (datefin.getMinutes() < 10 ? "0" + datefin.getMinutes() : datefin.getMinutes());
  }


  WithHeaderExample(user, setAlert,cb = null) {
    return (
      <Card style={{ "marginBottom": "1vh", "width": "100%" }} key={this.id}>
        <Card.Header style={{ "display": "flex", "justifyContent": "space-between" }} >
          < div > {DateFormatAbv(this.date.toDate())} {DateTimeAbv(this.date.toDate())}</div>
          <div style={{"fontSize":"11px","alignSelf":"center"}}>⌚ {this.temps} min</div>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.titre}</Card.Title>
          <Card.Text>
            {this.niveau}
          </Card.Text>

          {this.date < Timestamp.fromDate(new Date()) ?
            <div>
              Ce cours est passé.
            </div>
            :
            <>
              {user && this.users && this.users.includes(user.uid) ?
                <><Button variant="outline-danger" style={{ "marginRight": "10px" }}
                onClick={async () => {
                  //if the date is less than 24h before now, the cancel is forbiden
                  if(this.date.toDate() < new Date(new Date().getTime() + (24 * 60 * 60 * 1000))) {
                      setAlert({
                          open: true,
                          type: "error",
                          message: "Vous ne pouvez pas annuler un cours qui est dans moins de 24h"
                          });
                      return;
                  } 

                  if (window.confirm('Voulez-vous vraiment annuler ce cours ?')) {
                      //remove the user from the item2.users and update on firestore
                      const CaldendarDocRef = doc(db, 'calendrier', this.id);
                      const UserDocRef = doc(db,'Users',user.uid)
                      try{
                      await Promise.all(
                          [updateDoc(CaldendarDocRef, { users: arrayRemove(user.uid) }),
                          updateDoc(UserDocRef, {solde: increment(this.unite)})])
                          this.users = this.users.filter(e => e !== user.uid);
                          if (cb != null )
                          {cb();}
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
              {'('}{this.place - this.users.length}/{this.place}{")"} Places disponibles</>
                :
                <>

                  {this.place - this.users.length <= 0 ?
                    "Complet"
                    :
                    <div style={{"fontSize":"10px"}}> <Button variant="outline-success" style={{ "marginRight": "10px","fontSize":"12px" }} 
                      onClick={() => 
                      {
                        if(Reserver(this, setAlert, user)){
                          this.users.push(user.uid);
                        }
                      }}>Réserver !</Button>
                      {'('}{this.place - this.users.length}/{this.place}{")"} Places disponibles
                    </div>
                  }</>


              }
            </>
          }

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
      niveau: item.niveau,
      users: item.users,
      type: item.type,
      unite: item.unite,
      participation : item.participation
    };
  },
  fromFirestore: function (snapshot, options) {
    const item = snapshot.data(options);
    return new Item(item.titre, item.desc, item.date,
      item.temps, item.place, item.id, item.users, item.type,
      item.unite, item.niveau, item.participation);
  }
};