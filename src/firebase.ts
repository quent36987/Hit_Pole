import env from './env.json';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp); // For Authentication
const db = getFirestore(firebaseApp); // For Using Database
export { auth, db };
