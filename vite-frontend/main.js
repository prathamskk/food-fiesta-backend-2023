import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import { getFirebase, onAuth, getMenu, newOrder, updateNamePhoneProfile, onSignInSubmit, verifyCode } from './firebase'

import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    signInWithRedirect,
    createUserWithEmailAndPassword, updateCurrentUser,
    RecaptchaVerifier
} from 'firebase/auth';



const { auth } = getFirebase()
// createUserWithEmailAndPassword(auth, "normal@gmail.com","12345678")
// createUserWithEmailAndPassword(auth, "prathamskk@gmail.com","12345678")
// signInWithEmailAndPassword(auth, "normal@gmail.com","12345678")

const orderButton = document.getElementById('orderButton')
const signInButton = document.getElementById('signInButton')
const signOutButton = document.getElementById('signOutButton')
const verifyCodeButton = document.getElementById('verify-code-button')
const updateProfileButton = document.getElementById('updateProfileButton')
const code_input = document.getElementById('code_input')

orderButton.addEventListener('click', () => {


    newOrder({
        stall1: {
            23: 3,
            24: 3
        },
        stall2: {
            45: 1,
        }
    }).then(
        console.log("successfully added new order")
    )


})

updateProfileButton.addEventListener('click', () => {

    updateNamePhoneProfile("Pratham", 8108980846)
})

signOutButton.addEventListener('click', () => {
    auth.signOut()
})

signInButton.addEventListener('click', () => {

    signInWithEmailAndPassword(auth, "prathamskk@gmail.com", "12345678");
})





onAuth(user => {
    if (!user) {
        return console.log("No user logged in");
    }
    console.log("user logged in", user)

    getMenu()
})


window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
        console.log("captcha solved?");
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit("+918108980846");
    }
}, auth);

recaptchaVerifier.render().then(function (widgetId) {
    window.recaptchaWidgetId = widgetId;
});

verifyCodeButton.addEventListener('click', (e) => {
    e.preventDefault()
    verifyCode(code_input.value)
})