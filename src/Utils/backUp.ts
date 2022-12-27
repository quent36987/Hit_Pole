import { db } from '../firebase';
import { getAllUsersFirebase } from './firebaseUtils';
import { User } from '../data/User';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { ETypeCour, Item, ItemConverter } from '../data/Item';

const data = [
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/2/2023',
        temps: 60,
        place: '4 sur 12',
        desc: 'Pole',
        users: 'VALORGE Anne-Charlotte, Perillier  Amandine, Allorent Marion, Coquard  Elodie',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/3/2023',
        temps: 60,
        place: '2 sur 12',
        desc: 'Pole figures',
        users: 'Alloin  Ludivine, Picard Jennifer',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '1/4/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Bounekta Sarah, Coquard Emma , Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '1/4/2023',
        temps: 60,
        place: '2 sur 12',
        desc: 'Pole figures',
        users: 'Paquit  Bénédicte , Garnier Gwenaelle',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '1/4/2023',
        temps: 60,
        place: '7 sur 12',
        desc: 'Pole figures',
        users: 'Ormancey  Christelle, GUITTARD  Helena , Schrack  Sylviane , Langlois Marie-Laure, Cumont  Amélie , Jourdan  Armelle , Rodrigues  Rachel',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/4/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '1/7/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/9/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Dupety Patricia, Coquard  Elodie , VALORGE Anne-Charlotte',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/10/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Picard Jennifer',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '1/11/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '1/11/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '1/11/2023',
        temps: 60,
        place: '5 sur 12',
        desc: 'Pole figures',
        users: 'Ormancey  Christelle, Schrack  Sylviane , Cumont  Amélie , Jourdan  Armelle , Rodrigues  Rachel',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/11/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '1/14/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/16/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Dupety Patricia, Coquard  Elodie , VALORGE Anne-Charlotte',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/17/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Picard Jennifer',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '1/18/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '1/18/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '1/18/2023',
        temps: 60,
        place: '5 sur 12',
        desc: 'Pole figures',
        users: 'Ormancey  Christelle, Schrack  Sylviane , Cumont  Amélie , Jourdan  Armelle , Rodrigues  Rachel',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/18/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '1/21/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/23/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Dupety Patricia, Coquard  Elodie , VALORGE Anne-Charlotte',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/24/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Picard Jennifer',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '1/25/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '1/25/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '1/25/2023',
        temps: 60,
        place: '4 sur 12',
        desc: 'Pole figures',
        users: 'Schrack  Sylviane , Cumont  Amélie , Jourdan  Armelle , Rodrigues  Rachel',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/25/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '1/28/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/30/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Dupety Patricia, Coquard  Elodie , VALORGE Anne-Charlotte',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '1/31/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Picard Jennifer',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '2/1/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '2/1/2023',
        temps: 60,
        place: '3 sur 12',
        desc: 'Pole figures',
        users: 'Schrack  Sylviane , Cumont  Amélie , Rodrigues  Rachel',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/1/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '2/4/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/14/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '2/15/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '2/15/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '2/15/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/15/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '2/18/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/20/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/21/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '2/22/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '2/22/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '2/22/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/22/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '2/25/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/27/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '2/28/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '3/1/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '3/1/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '3/1/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '3/1/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole Ados/Adultes',
        niveau: 'Débutant/Inter 1',
        date: '3/4/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '3/6/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '3/7/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole ados',
        niveau: 'Initiation/débutant',
        date: '3/8/2023',
        temps: 60,
        place: '1 sur 12',
        desc: 'Pole figures',
        users: 'Confalonieri  Lucia',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Inter 1/2',
        date: '3/8/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Deb 2/3',
        date: '3/8/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    },
    {
        titre: 'Pole',
        niveau: 'Initiation/débutant',
        date: '3/8/2023',
        temps: 60,
        place: '0 sur 12',
        desc: 'Pole figures',
        users: '',
        participation: ''
    }
];

function findUsersId(usernames: string[], users: User[]): string[] {
    return usernames.map((name) => {
        const id =
            users.find((user) => {
                const NAME_WITHOUT_SPACE = `${user.nom}${user.prenom}`.replaceAll(' ', '');

                return NAME_WITHOUT_SPACE === name;
            })?.id ?? '';

        if (id === '') {
            console.log('erreur, not found:', name);
        }

        return id;
    });
}

async function addItem(): Promise<void> {
    const users = await getAllUsersFirebase();

    for (const item of data) {
        const usersNames = item.users.replaceAll(' ', '');

        const usersId = usersNames === '' ? [] : findUsersId(usersNames.split(','), users);

        const elt = new Item(
            item.titre,
            item.desc,
            Timestamp.fromDate(new Date(item.date)),
            item.temps,
            12,
            '',
            usersId,
            ETypeCour.COURS,
            1,
            item.niveau,
            []
        );

        console.log(elt);

        const collectionRef = collection(db, 'calendrier').withConverter(ItemConverter);
        await addDoc(collectionRef, elt);
    }
}

export { addItem };
