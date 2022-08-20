import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const App = createContext(null);
const Context = ({ children }) => {

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
    });
    const [perm, setPerm] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setUser(user);
            else setUser(null);
        });
    }, []);



    useEffect(() => {
        async function isadm() {
            if (!user || perm) {
                return;
            }

            console.log("setperm !",user.uid);
            const ref = doc(db, "ADM", user.uid);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
               
                setPerm(docSnap.data().perm);
            }
        };
        isadm();
    }, [user, perm]);


    return (
        <App.Provider
            value={{
                alert,
                setAlert,
                user,
                perm,
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
