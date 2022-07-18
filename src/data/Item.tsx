import { Timestamp } from "firebase/firestore";

export class Item {

    public titre: string;
    public desc: string;
    public date: Timestamp;
    public temps: number;
    public place: number;
    public id: string;

    constructor(titre: string, desc: string, date: Timestamp, temps: number, place: number, id:    string) {
        this.titre = titre;
        this.desc = desc;
        this.date = date;
        this.temps = temps;
        this.place = place;
        this.id = id;
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
            id: item.id
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);
        return new Item(item.titre, item.desc, item.date, item.temps, item.place, item.id);
    }
};