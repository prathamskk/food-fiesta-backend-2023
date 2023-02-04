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

const orderButton = document.getElementById("orderButton");
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const verifyCodeButton = document.getElementById("verify-code-button");
const updateProfileButton = document.getElementById("updateProfileButton");
const setcustomrole = document.getElementById("setcustomrole");
const setcustomroleSelf = document.getElementById("setcustomroleSelf");
const code_input = document.getElementById("code_input");
const stall_admin1 = document.getElementById("stall_admin1");
const stall_admin2 = document.getElementById("stall_admin2");
const stall_admin3 = document.getElementById("stall_admin3");
const stall_admin4 = document.getElementById("stall_admin4");
const stall_admin5 = document.getElementById("stall_admin5");
const stall_admin6 = document.getElementById("stall_admin6");
const stall_admin7 = document.getElementById("stall_admin7");
const stall_admin8 = document.getElementById("stall_admin8");
const stall_admin9 = document.getElementById("stall_admin9");
const stall_admin10 = document.getElementById("stall_admin10");
const stall_admin11 = document.getElementById("stall_admin11");
const stall_admin12 = document.getElementById("stall_admin12");
const super_admin = document.getElementById("super_admin");
const cashier = document.getElementById("cashier");

function createRoleArray() {
  const available_roles = [
    stall_admin1,
    stall_admin2,
    stall_admin3,
    stall_admin4,
    stall_admin5,
    stall_admin6,
    stall_admin7,
    stall_admin8,
    stall_admin9,
    stall_admin10,
    stall_admin11,
    stall_admin12,
    super_admin,
    cashier,
  ];
  console.log(cashier.checked);
  const selected_roles = [];
  for (let x of available_roles) {
    if (x.checked) {
      selected_roles.push(x.id);
    }
  }
  console.log(selected_roles);
  return selected_roles;
}

setcustomrole.addEventListener("click", () => {
  const { functions } = getFirebase();
  const selected_roles = createRoleArray();
  const addRole = httpsCallable(functions, "addRole");
  addRole({ uid: code_input.value, roles: selected_roles });
});

setcustomroleSelf.addEventListener("click", () => {
  const { functions } = getFirebase();
  console.log("setcs");
  const selected_roles = createRoleArray();
  const addRole = httpsCallable(functions, "addRole");
  addRole({ self: true, roles: selected_roles });
});

orderButton.addEventListener("click", () => {
  newOrder({
    stall1: {
      23: 3,
      24: 3,
    },
    stall2: {
      45: 1,
    },
  }).then(console.log("successfully added new order"));
});

updateProfileButton.addEventListener("click", () => {
  updatePhone(8108980846);
});

signOutButton.addEventListener("click", () => {
  auth.signOut();
});

onAuth((user) => {
  if (!user) {
    return console.log("No user logged in");
  }
  console.log("user logged in", user);

  getMenu();
});

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
