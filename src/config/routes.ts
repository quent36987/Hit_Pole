import { AjoutPage } from '../pages/AjoutPage';
import { AuthPage } from '../pages/AuthPage';
import { CalendrierPage } from '../pages/CalendrierPage';
import { ContactPage } from '../pages/ContactPage';
import { DashPage } from '../pages/Dashboard/UserDashPage';
import { ExportPage } from '../pages/ExportPage';
import { HomePage } from '../pages/HomePage';
import { InfoCourPage } from '../pages/Dashboard/PageInfoCour';
import { IRoute } from '../interfaces/route';
import { LogPage } from '../pages/Dashboard/LogPage';
import { ModifPage } from '../pages/ModifPage';
import { ParticipPage } from '../pages/Dashboard/ParticipPage';
import { ProfilePage } from '../pages/ProfilePage';
import { DuplicationPage } from '../pages/duplication/pages/DuplicationPage';
import { DuplicaPage } from '../pages/DuplicaPage';

const routes: IRoute[] = [
    {
        path: '/',
        name: 'Home Page',
        component: HomePage,
        exact: true
    },
    {
        path: '/profile',
        name: 'Profile Page',
        component: ProfilePage,
        exact: true
    },
    {
        path: '/auth/:type',
        name: 'Auth Page',
        component: AuthPage,
        exact: true
    },
    {
        path: '/ajout',
        name: 'Ajout Page',
        component: AjoutPage,
        exact: true
    },
    {
        path: '/duplication*',
        name: 'Duplica Page',
        component: DuplicationPage,
        exact: true
    },
    {
        path: '/duplica',
        name: 'Duplica Page',
        component: DuplicaPage,
        exact: true
    },
    {
        path: '/calendrier',
        name: 'Calendrier Page',
        component: CalendrierPage,
        exact: true
    },
    {
        path: '/contact',
        name: 'Contact Page',
        component: ContactPage,
        exact: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard Page',
        component: DashPage,
        exact: true
    },
    {
        path: '/modif/:id',
        name: 'Modif Page',
        component: ModifPage,
        exact: true
    },
    {
        path: '/particip/:id',
        name: 'Tcheck Page',
        component: ParticipPage,
        exact: true
    },
    {
        path: '/coursinfo/:id',
        name: 'Cours Info Page',
        component: InfoCourPage,
        exact: true
    },
    {
        path: '/export',
        name: 'Export Page',
        component: ExportPage,
        exact: true
    },
    {
        path: '/logs',
        name: 'Logs Page',
        component: LogPage,
        exact: true
    }
];

export { routes };
