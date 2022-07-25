export class User{

    public prenom : string;
    public nom : string;
    public solde : number;
    public genre : string;
    public id : string;

    constructor(prenom: string, nom: string, solde: number, genre: string){
        this.prenom = prenom;
        this.nom = nom;
        this.solde = solde;
        this.genre = genre;
        this.id = "";
    }
    
}

export const UserConverter = 
{
    toFirestore: function (item: User) {
        return {
            prenom: item.prenom,
            nom: item.nom,
            solde: item.solde,
            genre: item.genre,
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);
        return new User(item.firstName, item.lastName, item.solde, item.genre);
    }
};