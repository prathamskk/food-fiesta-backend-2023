/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

import {
  getAuth,
  updateProfile,
  connectAuthEmulator,
  signInWithPhoneNumber,
  onAuthStateChanged,
  reauthenticateWithRedirect,
  RecaptchaVerifier,
} from "firebase/auth";
import { where } from "firebase/firestore";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,

  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APPID,

  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

function initializeServices() {
  const isConfigured = getApps().length > 0;
  const firebaseApp = initializeApp(firebaseConfig);
  const appCheck = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider('6Le65I0kAAAAANibM2WZrCQdBJWIVzn7AKz_H6j4'),
    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  })
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);
  return { firebaseApp, firestore, auth, isConfigured, functions };
}

function connectToEmulators({ auth, firestore, functions }) {
  if (location.hostname === "localhost") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
    console.log("auth emulators");
  }
}

export function getFirebase() {
  const services = initializeServices();
  if (!services.isConfigured) {
    connectToEmulators(services);
    console.log("connected to emulators");
  }
  return services;
}

export function newOrder(data) {
  const { functions } = getFirebase();
  const newOrder = httpsCallable(functions, "newOrder");
  return newOrder(data);
}

export function getMenu() {
  const MENU_DOC_ID = "menu_items";
  const MENU_COLLECTION_ID = "menu";
  const { firestore } = getFirebase();
  const menuCol = collection(firestore, MENU_COLLECTION_ID);
  const menuDoc = doc(menuCol, MENU_DOC_ID);
  const unsub = onSnapshot(menuDoc, (document) => {
    console.log("Current data: ", document.data());
  });
  return { unsub };
}

export function onAuth(callback) {
  const { auth } = getFirebase();
  return onAuthStateChanged(auth, (user) => {
    console.log(user);
    callback(user);
  });
}

export function updatePhone(phone_number) {
  const { functions } = getFirebase();

  const updatePhone = httpsCallable(functions, "updatePhone");
  updatePhone({ phone_number: phone_number });
}

export function onSignInSubmit(phone_number) {
  const appVerifier = window.recaptchaVerifier;
  const { auth } = getFirebase();
  signInWithPhoneNumber(auth, phone_number, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      console.log("sign in with phone number initiated");
      window.confirmationResult = confirmationResult;
      // ...
    })
    .catch((error) => {
      console.log(error, "SMS not sent");
      // Error; SMS not sent
      // ...
    });
  // [END auth_phone_signin]
}

export function verifyCode(verification_code) {
  confirmationResult
    .confirm(verification_code)
    .then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log("User signed in successfully.");
    })
    .catch((error) => {
      console.log("User couldn't sign in (bad verification code?)");
    });
}
