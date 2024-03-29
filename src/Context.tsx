import firebase from 'firebase/compat';
import User = firebase.User;
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserConverter, User as UserModel } from './data/User';

const app = createContext(null);

interface IAppState {
    user: User;
    hasPerm: boolean;
    profil: UserModel;
}

// eslint-disable-next-line react/prop-types
const Context = ({ children }): JSX.Element => {
    const [hasPerm, setHasPerm] = useState<boolean>(false);
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
            if (!user || hasPerm) {
                return;
            }

            console.log('setperm !', user.uid);
            const ref = doc(db, 'ADM', user.uid);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                setHasPerm(docSnap.data().perm);
            }
        }

        void isadm();
    }, [user, hasPerm]);

    useEffect(() => {
        if (!user) {
            return;
        }

        void loadProfile();
    }, [user]);

    async function loadProfile(): Promise<void> {
        const query = doc(db, 'Users', user.uid).withConverter(UserConverter);
        const docsnap = await getDoc(query);
        const pro = docsnap.data();
        pro.id = docsnap.id;
        setProfil(pro);
    }

    return (
        <app.Provider
            value={{
                user,
                hasPerm,
                profil
            }}>
            {children}
        </app.Provider>
    );
};

const AppState = (): IAppState => {
    return useContext(app);
};

export { Context, AppState };
