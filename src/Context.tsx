/* eslint-disable */
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User, UserConverter } from './data/User';

const App = createContext(null);

const Context = ({ children }) => {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    const [perm, setPerm] = useState(false);
    const [user, setUser] = useState(null);
    const [profil, setProfil] = useState<User>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else setUser(null);
        });
    }, []);

    useEffect(() => {
        async function isadm() {
            if (!user || perm) {
                return;
            }

            console.log('setperm !', user.uid);
            const ref = doc(db, 'ADM', user.uid);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                setPerm(docSnap.data().perm);
            }
        }

        isadm();
    }, [user, perm]);

    useEffect(() => {
        if (!user) {
            return;
        }

        LoadProfile();
    }, [user]);

    async function LoadProfile() {
        const query = doc(db, 'Users', user.uid).withConverter(UserConverter);
        const docsnap = await getDoc(query);
        const pro = docsnap.data();
        pro.id = docsnap.id;
        setProfil(pro);
    }

    return (
        <App.Provider
            value={{
                alert,
                setAlert,
                user,
                perm,
                profil
            }}
        >
            {children}
        </App.Provider>
    );
};

export default Context;

export const AppState = () => {
    return useContext(App);
};
