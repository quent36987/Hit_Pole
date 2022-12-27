import { getAllItems, getAllUsersFirebase } from './firebaseUtils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function exportCSV() {
    // titre_niveau - date - temps - nombre inscrit/place  - desc - users - participation
    const allItems = await getAllItems();
    const allUsers = await getAllUsersFirebase();

    const data = allItems.map((item) => {
        const users = item.users.map((id) => {
            const user = allUsers.find((user) => user.id === id);

            return user != null ? user.nom + ' ' + user.prenom : '';
        });

        const participation = item.participation.map((id) => {
            const user = allUsers.find((user) => user.id === id);

            return user != null ? user.nom + ' ' + user.prenom : '';
        });

        return {
            titre: item.titre,
            niveau: item.niveau,
            date: item.date.toDate().toString(),
            temps: item.temps,
            place: item.place,
            desc: item.desc,
            users: users.join(', '),
            usersId: item.users,
            participation: participation.join(', ')
        };
    });

    return data;
}
