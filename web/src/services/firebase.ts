import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { isProduction } from "helpers/consts";

let firebaseConfig = undefined;

if (isProduction) {
  firebaseConfig = {
    apiKey: "AIzaSyBui2yy-H2b_rQ_jbGe2ivspMklVOc0lqg",
    authDomain: "doozle.firebaseapp.com",
    databaseURL: "https://doozle.firebaseio.com",
    projectId: "doozle",
    storageBucket: "doozle.appspot.com",
    messagingSenderId: "28809106682",
    appId: "1:28809106682:web:35988f4d51bd700864a543",
    measurementId: "G-9663V0ZZB2",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyAzsih1t8p0qk6ikK6czZRy4wSlIRtUjG0",
    authDomain: "doozle-dev.firebaseapp.com",
    databaseURL: "https://doozle-dev.firebaseio.com",
    projectId: "doozle-dev",
    storageBucket: "doozle-dev.appspot.com",
    messagingSenderId: "400467290883",
    appId: "1:400467290883:web:c7a59ab60dfeab41b61736",
    measurementId: "G-E20QRVKH2P",
  };
}

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth;
const db = firebase.firestore();
const functions = firebase.functions();
const storage = firebase.storage();

if (!isProduction) {
  // Connect to local emulators in development
  db.settings({
    host: "localhost:8080",
    ssl: false,
  });
  functions.useFunctionsEmulator("http://localhost:5001");
}

export { firebase, auth, db, functions, storage };
