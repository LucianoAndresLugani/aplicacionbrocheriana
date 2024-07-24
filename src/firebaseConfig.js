import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZbftXq8tLUQVV5-lL8kL6OZrGELxAoAA",
  authDomain: "proyecto-brocheriano.firebaseapp.com",
  projectId: "proyecto-brocheriano",
  storageBucket: "proyecto-brocheriano.appspot.com",
  messagingSenderId: "996925797040",
  appId: "1:996925797040:web:05787cb3ca11f992b84175",
  measurementId: "G-HPPT8YZ1X5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  
  export { auth, firestore };