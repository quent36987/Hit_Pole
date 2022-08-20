export class User{

    public prenom : string;
    public nom : string;
    public solde : number;
    public genre : string;
    public id : string;
    public tel : string;

    constructor(prenom: string, nom: string, solde: number, genre: string,tel: string){
        this.prenom = prenom ? prenom : "";
        this.nom = nom ? nom : "";
        this.solde = solde ? solde : 0;
        this.genre = genre ? genre : "";
        this.id = "";
        this.tel = tel ? tel : "";
    }

    public getFullName(): string {
        return this.prenom + " " + this.nom;
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
            tel: item.tel,
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);
        return new User(item.firstName, item.lastName, item.solde, item.genre,item.tel);
    }
};