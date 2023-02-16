import "./style.css";
import javascriptLogo from "./javascript.svg";
import {
  getFirebase,
  onAuth,
  getMenu,
  newOrder,
  updatePhone,
  onSignInSubmit,
  verifyCode,
} from "./firebase";

import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  RecaptchaVerifier,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

import { signInWithPopup } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
const provider = new GoogleAuthProvider();

const { auth } = getFirebase();

const googleButton = document.getElementById("signinDiv");
googleButton.addEventListener("click", () => {
  handleGoogleLogin();
});

function handleGoogleLogin() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
      // ...
    });
}
// createUserWithEmailAndPassword(auth, "normal@gmail.com","12345678")
// createUserWithEmailAndPassword(auth, "prathamskk@gmail.com","12345678")
// signInWithEmailAndPassword(auth, "normal@gmail.com","12345678")

// const orderButton = document.getElementById("orderButton");
// const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
// const verifyCodeButton = document.getElementById("verify-code-button");
// const updateProfileButton = document.getElementById("updateProfileButton");
const setcustomrole = document.getElementById("setcustomrole");
// const setcustomroleSelf = document.getElementById("setcustomroleSelf");
const code_input = document.getElementById("code_input");
const stall01 = document.getElementById("stall-01");
const stall02 = document.getElementById("stall-02");
const stall03 = document.getElementById("stall-03");
const stall04 = document.getElementById("stall-04");
const stall05 = document.getElementById("stall-05");
const stall06 = document.getElementById("stall-06");
const stall07 = document.getElementById("stall-07");
const stall08 = document.getElementById("stall-08");
const stall09 = document.getElementById("stall-09");
const stall10 = document.getElementById("stall-10");
const stall11 = document.getElementById("stall-11");
const stall12 = document.getElementById("stall-12");
const refund = document.getElementById("refund");
const cashier = document.getElementById("cashier");


setcustomrole.addEventListener("click", () => {
  const value = document.querySelector('input[name="roles"]:checked')?.value;
  console.log(value);
  if (value !== undefined) {
    const { functions } = getFirebase();
    const addRole = httpsCallable(functions, "addRole");
    addRole({ uid: code_input.value, roles: [value] });
  } else {
    console.log("no role radio selected");
  }
});


// setcustomroleSelf.addEventListener("click", () => {
//   const value = document.querySelector('input[name="roles"]:checked')?.value;
//   console.log(value);
//   if (value !== undefined) {
//     const { functions } = getFirebase();
//     console.log("setcs");
//     const addRole = httpsCallable(functions, "addRole");
//     addRole({ self: true, roles: [value] });
//   } else {

//     console.log("no role radio selected");
//   }
// });

// orderButton.addEventListener("click", () => {
//   newOrder({
//     stall1: {
//       23: 3,
//       24: 3,
//     },
//     stall2: {
//       45: 1,
//     },
//   }).then(console.log("successfully added new order"));
// });

// updateProfileButton.addEventListener("click", () => {
//   updatePhone(8108980846);
// });

signOutButton.addEventListener("click", () => {
  auth.signOut();
});

// onAuth((user) => {
//   if (!user) {
//     return console.log("No user logged in");
//   }
//   console.log("user logged in", user);

//   getMenu();
// });

// signInButton.addEventListener("click", () => {
//   signInWithEmailAndPassword(auth, "prathamskk@gmail.com", "12345678");
// });

// window.recaptchaVerifier = new RecaptchaVerifier(
//   "sign-in-button",
//   {
//     size: "invisible",
//     callback: (response) => {
//       console.log("captcha solved?");
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       onSignInSubmit("+918108980846");
//     },
//   },
//   auth
// );

// recaptchaVerifier.render().then(function (widgetId) {
//   window.recaptchaWidgetId = widgetId;
// });

// verifyCodeButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   verifyCode(code_input.value);
// });
