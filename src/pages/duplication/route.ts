import { IRoute } from '../../interfaces/route';
import { ChoixCours } from './pages/ChoixCours';
import { CopyWeek } from './pages/CopyWeek';
import { MainPage } from './pages/MainPage';
import { PasteWeek } from './pages/PasteWeek';
import { PasteValidation } from './pages/PasteValidation';
import { CopyValidation } from './pages/CopyValidation';
import { DUPLICATION_PATH } from './constants';

const routes: IRoute[] = [
    {
        path: `/${DUPLICATION_PATH}/`,
        name: 'Home',
        component: MainPage,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/cours`,
        name: 'Choix Cours',
        component: ChoixCours,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/copy-week`,
        name: 'Choix semaine',
        component: CopyWeek,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/paste-week`,
        name: 'Choix duplication',
        component: PasteWeek,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/paste-validation`,
        name: 'validation',
        component: PasteValidation,
        exact: true
    },
    {
        path: `/${DUPLICATION_PATH}/copy-validation`,
        name: 'validation',
        component: CopyValidation,
        exact: true
    }
];

export { routes };
