import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";


const firebaseConfig = {
    apiKey: "AIzaSyBui2yy-H2b_rQ_jbGe2ivspMklVOc0lqg",
    authDomain: "doozle.firebaseapp.com",
    databaseURL: "https://doozle.firebaseio.com",
    projectId: "doozle",
    storageBucket: "doozle.appspot.com",
    messagingSenderId: "28809106682",
    appId: "1:28809106682:web:35988f4d51bd700864a543",
    measurementId: "G-9663V0ZZB2"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth;
const db = firebase.firestore();
const functions = firebase.functions();

if (location.hostname === "localhost") {
    // Connect to local emulators in development.
    db.settings({
        host: "localhost:8080",
        ssl: false
    });
    functions.useFunctionsEmulator("http://localhost:5001")
}

export { auth, db, functions };