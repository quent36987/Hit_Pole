import { Card } from 'react-bootstrap';
import React from 'react';
import { ReserverButton } from '../componants/Reserver';
import { Timestamp } from 'firebase/firestore';
import { dateFormatAbv, timeAbv } from '../Utils/utils';

const Titres = ['Pole', 'Pole ados', 'Hit Streching', 'Chair et Exotic', 'Pole Ados/Adultes'];

const Niveaux = [
    'Tout niveau',
    'Initiation/débutant',
    'Deb 2/3',
    'Débutant/Inter 1',
    'Inter 1',
    'Inter 1/2',
    'Inter 2'
];

enum ETypeCour {
    COURS,
    INITIATION,
    STAGE,
    PRACTICE
}

class Item {
    public type: ETypeCour;
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
        type: ETypeCour,
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
        this.type = type || ETypeCour.COURS;
        this.unite = unite || 0;

        this.users = users || [];
        this.niveau = niveau || '';
        this.participation = participation || [];
    }

    public getHour(): string {
        // returun HH:MM - HH:MM
        const datefin = new Date(this.date.seconds * 1000 + this.temps * 60 * 1000);
        const dateDebut = new Date(this.date.seconds * 1000);

        return `${dateDebut.getHours() < 10 ? `0${dateDebut.getHours()}` : dateDebut.getHours()}:${
            dateDebut.getMinutes() < 10 ? `0${dateDebut.getMinutes()}` : dateDebut.getMinutes()
        } - ${datefin.getHours() < 10 ? `0${datefin.getHours()}` : datefin.getHours()}:${
            datefin.getMinutes() < 10 ? `0${datefin.getMinutes()}` : datefin.getMinutes()
        }`;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    WithHeaderExample(user, cb = null): JSX.Element {
        return (
            <Card style={{ marginBottom: '1vh', width: '100%' }} key={this.id}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {' '}
                        {dateFormatAbv(this.date.toDate())} {timeAbv(this.date.toDate())}
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

const ItemConverter = {
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

export { Titres, ETypeCour, Niveaux, ItemConverter, Item };
