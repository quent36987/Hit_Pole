const mois = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

function getMonday(semaine: number, annee: number): Date {
    const firstMonday = new Date(annee, 0, 1);

    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() + 1);
    }

    const decal = firstMonday.getDay() - 1;

    return new Date(
        firstMonday.getFullYear(),
        firstMonday.getMonth(),
        firstMonday.getDate() + decal + semaine * 7
    );
}

function getSemaine(annee: number): string[] {
    const semaines = [];

    const datefirst = [];
    // get the first monday of the year
    const firstMonday = new Date(annee, 0, 1);

    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() + 1);
    }

    console.log('first monday', firstMonday.toString(), firstMonday.getDay());

    const decal = firstMonday.getDay() - 1;

    // return all weeks (monday to sunday) of the year with the format "DD/MM to DD/MM"
    for (let i = 0; i < 52; i++) {
        const date = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7
        );

        const date2 = new Date(
            firstMonday.getFullYear(),
            firstMonday.getMonth(),
            firstMonday.getDate() + decal + i * 7 + 6
        );

        semaines.push(
            date.toLocaleDateString() +
                ' to ' +
                date2.toLocaleDateString() +
                '  (' +
                mois[date.getMonth()] +
                ')'
        );

        datefirst.push(date);
    }

    return semaines;
}

export { getSemaine, getMonday };
