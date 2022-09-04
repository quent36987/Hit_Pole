import IRoute from '../interfaces/route';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import AjoutPage from '../pages/AjoutPage';
import CalendrierPage from '../pages/CalendrierPage';
import ContactPage from '../pages/ContactPage';
import DuplicaPage from '../pages/DuplicaPage';
import ModifPage from '../pages/ModifPage';
import DashPage from '../pages/Dashboard/UserDashPage';
import ParticipPage from '../pages/Dashboard/ParticipPage';
import InfoCourPage from '../pages/Dashboard/PageInfoCour';
import ExportPage from '../pages/ExportPage';



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
]

export default routes;