import firebase from 'firebase/compat';
import User = firebase.User;
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserConverter, User as UserModel } from './data/User';

const App = createContext(null);

interface IAppState {
    alert: any;
    setAlert: any;
    user: User;
    perm: boolean;
    profil: UserModel;
}

// eslint-disable-next-line react/prop-types
const Context = ({ children }): JSX.Element => {
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    const [perm, setPerm] = useState<boolean>(false);
    const [user, setUser] = useState<User>(null);
    const [profil, setProfil] = useState<UserModel>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // @ts-expect-error
                setUser(user);
            } else setUser(null);
        });
    }, []);

    useEffect(() => {
        async function isadm(): Promise<void> {
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

        void isadm();
    }, [user, perm]);

    useEffect(() => {
        if (!user) {
            return;
        }

        void LoadProfile();
    }, [user]);

    async function LoadProfile(): Promise<void> {
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
            }}>
            {children}
        </App.Provider>
    );
};

const AppState = (): IAppState => {
    return useContext(App);
};

export { Context, AppState };
