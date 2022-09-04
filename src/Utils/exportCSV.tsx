import { getAllItems, getAllUsersFirebase } from './firebaseUtils';

export async function ExportCSV ()
{
    // titre_niveau - date - temps - nombre inscrit/place  - desc - users - participation
    const allItems = await getAllItems();
    const allUsers = await getAllUsersFirebase();

    const data = allItems.map((item) => {
        const users = item.users.map((id) => {
            const user = allUsers.find((user) => user.id === id);
            return user ? user.nom + " " + user.prenom : "";
        });
        const participation = item.participation.map((id) => {
            const user = allUsers.find((user) => user.id === id);
            return user ? user.nom + " " + user.prenom : "";
        });
        return {
            titre: item.titre,
            niveau: item.niveau,
            date: item.date.toDate().toLocaleDateString(),
            temps: item.temps,
            place: `${item.users.length} sur ${item.place}`,
            desc: item.desc,
            users: users.join(", "),
            participation: participation.join(", "),
        };
    });
    return data;
}