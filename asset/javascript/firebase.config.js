import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,

} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js'
import {
    getFirestore,
    serverTimestamp,
    collection,
    addDoc,
    setDoc,
    doc,
    onSnapshot,
    getDocs,
    query, orderBy, limit

} from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'


const firebaseConfig = {
    apiKey: "AIzaSyCowVhNX23Qncm8C1sSckJBDZsX6i4Wrnc",
    authDomain: "blog-app-6c9b4.firebaseapp.com",
    projectId: "blog-app-6c9b4",
    storageBucket: "blog-app-6c9b4.firebasestorage.app",
    messagingSenderId: "602669397293",
    appId: "1:602669397293:web:66d408eca23866102c4fa4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    collection,
    serverTimestamp,
    onSnapshot,
    addDoc,
    setDoc,
    db,
    doc,
    getDocs, query, orderBy, limit
} 