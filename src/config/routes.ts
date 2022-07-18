import IRoute from '../interfaces/route';
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import AjoutPage from '../pages/AjoutPage';
import CalendrierPage from '../pages/CalendrierPage';


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
        path: '/calendrier',
        name: 'Calendrier Page',
        component: CalendrierPage,
        exact: true
    }

]

export default routes;