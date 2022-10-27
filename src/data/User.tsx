class User {
    public prenom: string;
    public nom: string;
    public solde: number;
    public genre: string;
    public id: string;
    public tel: string;
    public famille: string[] = [];

    constructor(
        prenom: string,
        nom: string,
        solde: number,
        genre: string,
        tel: string,
        famille: string[]
    ) {
        this.prenom = prenom || '';
        this.nom = nom || '';
        this.solde = solde || 0;
        this.genre = genre || '';
        this.id = '';
        this.tel = tel || '';
        this.famille = famille || [];
    }

    public getFullName(): string {
        return this.prenom + ' ' + this.nom;
    }
}

const UserConverter = {
    toFirestore: function (item: User) {
        return {
            prenom: item.prenom,
            nom: item.nom,
            solde: item.solde,
            genre: item.genre,
            tel: item.tel,
            famille: item.famille
        };
    },
    fromFirestore: function (snapshot, options) {
        const item = snapshot.data(options);

        return new User(
            item.firstName,
            item.lastName,
            item.solde,
            item.genre,
            item.tel,
            item.famille
        );
    }
};

export { User, UserConverter };
