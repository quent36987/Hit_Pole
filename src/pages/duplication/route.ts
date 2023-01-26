import { IRoute } from '../../interfaces/route';
import { ChoixCours } from './pages/ChoixCours';
import { ChoixSemaine } from './pages/ChoixSemaine';
import { ChoixType } from './pages/ChoixType';
import { ChoixDuplication } from './pages/ChoixDuplication';
import { Validation } from './pages/Validation';

const DUPLICATION_PATH = 'duplication';

const routes: IRoute[] = [
    {
        path: `/${DUPLICATION_PATH}/`,
        name: 'Home',
        component: ChoixType,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/cours`,
        name: 'Choix Cours',
        component: ChoixCours,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/semaine`,
        name: 'Choix semaine',
        component: ChoixSemaine,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/duplication`,
        name: 'Choix duplication',
        component: ChoixDuplication,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/validation`,
        name: 'validation',
        component: Validation,
        exact: true
    }
];

export { routes };
