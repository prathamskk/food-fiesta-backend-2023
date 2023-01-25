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
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  reauthenticateWithRedirect,
} from "firebase/auth";
import { firebaseConfig } from "./config";
import { where } from "firebase/firestore";
function initializeServices() {
  const isConfigured = getApps().length > 0;
  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  return { firebaseApp, firestore, auth, isConfigured };
}

function connectToEmulators({ auth, firestore }) {
  if (location.hostname === "localhost") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
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

export function streamMessages() {
  const MENU_DOC_ID = "menu_items";
  const MENU_COLLECTION_ID = "menu";
  const { firestore } = getFirebase();
  const menuCol = collection(firestore, MENU_COLLECTION_ID);
  const menuDoc = doc(menuCol, MENU_DOC_ID);
  const unsub = onSnapshot(menuDoc, (document) => {
    console.log("Current data: ", document.data());
  });

    setDoc(doc(firestore,'menu/menu_items'),{
      "stall1": {
          "23": {
              "price": 22,
              "name": "Vada Pav",
              "availability": true
          },
          "24": {
              "price": 20,
              "name": "Kanda Bhaji",
              "availability": true
          }
      },
      "stall2": {
          "45": {
              "price": 35,
              "name": "Plain Dosa",
              "availability": true
          },
          "67": {
              "price": 30,
              "name": "Wada Sambar",
              "availability": true
          }
      }
  })
  // const menuCol = collection(firestore, 'menu', MENU_DOC_ID, 'messages')
  // const menuDoc = doc(menuCol, MENU_DOC_ID )
  // const stream = (callback) => onSnapshot(menuDoc, snapshot => {
  //   const messages = snapshot.docs.map(doc => {
  //     const isDelivered = !doc.metadata.hasPendingWrites;
  //     return {
  //       isDelivered,
  //       id: doc.id,
  //       ...doc.data()
  //     };
  //   })

  //   callback(messages);
  // });

  // const addMessage = (message) => addDoc(messagesCol, {
  //   timestamp: serverTimestamp(),
  //   ...message,
  // });
  // return { stream, addMessage };
  return { unsub };
}

export function onAuth(callback) {
  const { auth } = getFirebase();
  return onAuthStateChanged(auth, (user) => {
    console.log(user);
    callback(user);
  });
}
