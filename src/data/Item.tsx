/* eslint-disable */
import { Timestamp } from 'firebase/firestore';
import { Card } from 'react-bootstrap';
import ReserverButton from '../componants/Reserver';
import { DateFormatAbv, TimeAbv } from '../Utils/utils';

export const Titres = ['Pole', 'Pole ados', 'Hit Streching', 'Chair et Exotic'];
export const Niveaux = [
    'Tout niveau',
    'Initiation/débutant',
    'Deb 2/3',
    'Débutant/Inter 1',
    'Inter 1',
    'Inter 1/2',
    'Inter 2'
];

export enum TYPE_COURS {
    COURS,
    INITIATION,
    STAGE,
    PRACTICE
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
    public participation: string[] = [];

    constructor(
        titre: string,
        desc: string,
        date: Timestamp,
        temps: number,
        place: number,
        id: string,
        users: string[],
        type: TYPE_COURS,
        unite: number,
        niveau: string,
        participation: string[]
    ) {
        this.titre = titre || '';
        this.desc = desc || '';
        this.date = date || new Timestamp(0, 0);
        this.temps = temps || 0;
        this.place = place || 0;
        this.id = id || '';
        this.users = users || [];
        this.type = type || TYPE_COURS.COURS;
        this.unite = unite || 0;

        this.users = users || [];
        this.niveau = niveau || '';
        this.participation = participation || [];
    }

    public getHour(): string {
        // returun HH:MM - HH:MM
        const datefin = new Date(this.date.seconds * 1000 + this.temps * 60 * 1000);
        const dateDebut = new Date(this.date.seconds * 1000);

        return (
            (dateDebut.getHours() < 10 ? '0' + dateDebut.getHours() : dateDebut.getHours()) +
            ':' +
            (dateDebut.getMinutes() < 10 ? '0' + dateDebut.getMinutes() : dateDebut.getMinutes()) +
            ' - ' +
            (datefin.getHours() < 10 ? '0' + datefin.getHours() : datefin.getHours()) +
            ':' +
            (datefin.getMinutes() < 10 ? '0' + datefin.getMinutes() : datefin.getMinutes())
        );
    }

    WithHeaderExample(user, cb = null) {
        return (
            <Card style={{ marginBottom: '1vh', width: '100%' }} key={this.id}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {' '}
                        {DateFormatAbv(this.date.toDate())} {TimeAbv(this.date.toDate())}
                    </div>
                    <div style={{ fontSize: '11px', alignSelf: 'center' }}>⌚ {this.temps} min</div>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{this.titre}</Card.Title>
                    <Card.Text>{this.niveau}</Card.Text>

                    <div style={{ fontSize: '10px' }}>
                        {user ? (
                            <ReserverButton
                                item={this}
                                userId={user ? user.uid : null}
                                cb={() => {
                                    if (cb !== null) cb();
                                }}
                            />
                        ) : null}
                        {'('}
                        {this.place - this.users.length}/{this.place}
                        {')'} Places disponibles
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export const ItemConverter = {
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
            participation: item.participation
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);

        return new Item(
            item.titre,
            item.desc,
            item.date,
            item.temps,
            item.place,
            item.id,
            item.users,
            item.type,
            item.unite,
            item.niveau,
            item.participation
        );
    }
};
