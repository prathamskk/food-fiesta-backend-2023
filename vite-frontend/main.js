import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { getFirebase , onAuth , streamMessages } from './firebase'

import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, TwitterAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';


const {auth}=getFirebase()
// createUserWithEmailAndPassword(auth, "normal@gmail.com","12345678")
// signInWithEmailAndPassword(auth, "normal@gmail.com","12345678")
signInWithEmailAndPassword(auth, "prathamskk@gmail.com", "12345678");
onAuth(user => console.log("user logged in" ,user))
streamMessages()