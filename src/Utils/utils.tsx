import { FirebaseError } from "firebase/app";
import { arrayUnion, doc, FieldValue, Firestore, increment, updateDoc } from "firebase/firestore";
import { AppState } from "../Context";
import { Item } from "../data/Item";
import { db } from "../firebase";

export function StringSymplify(name : string)
{
        var name_modif = name.replace(/\((.)*\)/g,"")
        .replace(/([0-9]+[\s]*([àaou]|ou)[\s]*[0-9]+)*/g,"")
        .replace(/[\s\d-+'*]/g, "").toLocaleLowerCase().
        normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (name_modif.endsWith("s")) {
            name_modif = name_modif.substring(0, name_modif.length - 1);
        }
        return name_modif;
}

export function formatTime(time: number) {
    if (time === -1) {
        return "♾";
    }
    if (time === -2) {
        return "Finished !"
    }
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        return `${minutes}:0${seconds}`
    }
    return `${minutes}:${seconds}`;
}

export function DateFormat(date : Date) {
    // format : dd/mm à hh:mm
    let day = date.getDate();
    let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let str = day + "/" + month + " à " + hour + ":" + minute;
    return str;
}

   
export async function Reserver(item : Item,setAlert,user)
{
    if (user == null)
    {
        setAlert({
            open: true,
            type: "error",
            message: "Vous devez être connecté pour réserver un événement"
        });
        return;
    }
    try {
        const CaldendarDocRef = doc(db, 'calendrier', item.id);
        const UserDocRef = doc(db,'Users',user.uid)
        await updateDoc(CaldendarDocRef, { users: arrayUnion(user.uid) });
        await updateDoc(UserDocRef, {solde: increment(-item.unite)})
        setAlert({
            open: true,
            type: "success",
            message: "Vous avez réservé l'événement"
        });
    } 
    catch (error) {
        console.log(error);
    }
}
