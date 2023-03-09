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
  getDocs,
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
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  if (location.hostname !== "localhost") {
    const appCheck = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider('6Le65I0kAAAAANibM2WZrCQdBJWIVzn7AKz_H6j4'),
      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true
    })
  }
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

export function getOrders() {
  const ORDERS_COLLECTION_ID = "orders";
  const { firestore } = getFirebase();
  const orderCol = collection(firestore, ORDERS_COLLECTION_ID);
  const q = query(
    orderCol,
    // where("payment_status", "==", "unpaid"),
    orderBy("order_placed_timestamp", "asc"),
    // limit(15)
  );
  const orderdocs = getDocs(q)

  orderdocs.then((snapshot) => {
    const orders = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    console.log(orders);
  })
}

export function updateMenu() {
  const MENU_DOC_ID = "menu_items";
  const MENU_COLLECTION_ID = "menu";
  const { firestore } = getFirebase();
  const menuCol = collection(firestore, MENU_COLLECTION_ID);
  const menuDoc = doc(menuCol, MENU_DOC_ID);
  setDoc(menuDoc, {
    "stall-01": {
      "10": {
        "availability": true,
        "name": "Pav Bhaji",
        "price": 50
      },
      "11": {
        "availability": true,
        "name": "Cupcakes (1 Pcs)",
        "price": 30
      },
      "12": {
        "availability": true,
        "name": "Pastries (1 Pcs)",
        "price": 50
      },
  
      "13": {
        "availability": true,
        "name": "Appam (3 Pcs)",
        "price": 20
      },
      "14": {
        "availability": true,
        "name": "Gulab Jamun (2 Pcs)",
        "price": 20
      }
    },
    "stall-02": {
      "17": {
        "price": 50,
        "availability": true,
        "name": "peri-peri twister's"
      },
      "18": {
        "price": 60,
        "availability": true,
        "name": "cheese twister's"
      },
      "19": {
        "price": 60,
        "name": "chipotle twister's",
        "availability": true
      },
      "20": {
        "name": "mayonnaise twister's",
        "availability": true,
        "price": 60
      },
      "21": {
        "price": 60,
        "name": "tandoori twister's",
        "availability": true
      },
      "22": {
        "price": 80,
        "availability": true,
        "name": "DP's special twister's"
      },
      "23": {
        "availability": true,
        "price": 45,
        "name": "normal burger"
      },
      "24": {
        "price": 55,
        "availability": true,
        "name": "tandoori burger"
      },
      "25": {
        "availability": true,
        "name": "cheese burger",
        "price": 60
      },
      "26": {
        "name": "DP's special burger",
        "price": 80,
        "availability": true
      },
      "27": {
        "price": 60,
        "availability": true,
        "name": "cheese nachos"
      },
      "28": {
        "price": 60,
        "name": "Peri-peri nachos",
        "availability": true
      },
      "29": {
        "price": 80,
        "name": "DP's special nachos",
        "availability": true
      }
    },
    "stall-03": {
      "30": {
        "availability": true,
        "name": "Mango Milkshake",
        "price": 25
      },
      "31": {
        "availability": true,
        "name": "Chocolate Milkshake",
        "price": 30
      },
      "32": {
        "availability": true,
        "name": "Strawberry Milkshake",
        "price": 30
      }
    },
    "stall-04": {
      "40": {
        "availability": true,
        "name": "Schezwan fried rice",
        "price": 55
      },
      "41": {
        "availability": true,
        "name": "Manchurian Schezwan fried rice",
        "price": 75
      },
      "42": {
        "availability": true,
        "name": "Grilled Sandwich",
        "price": 55
      },
      "43": {
        "availability": true,
        "name": "Cheese Grilled Sandwich",
        "price": 75
      },
      "44": {
        "availability": true,
        "name": "Manchurian Schezwan fried rice + Cheese Grilled Sandwich",
        "price": 120
      }
    },
    "stall-05": {
      "50": {
        "availability": true,
        "name": "Virgin Mojito",
        "price": 60
      },
      "51": {
        "availability": true,
        "name": "Blue Lagoon",
        "price": 70
      },
      "52": {
        "availability": true,
        "name": "Green Sparkle",
        "price": 70
      }
    },
    "stall-06": {
      "60": {
        "availability": true,
        "name": "Pani Puri",
        "price": 20
      },
      "61": {
        "availability": true,
        "name": "Sev Puri",
        "price": 30
      },
      "62": {
        "availability": true,
        "name": "Dahi Puri",
        "price": 30
      }
    },
    "stall-07": {
      "66": {
        "price": 10,
        "availability": true,
        "name": "plain milk chocolate (2 pcs)"
      },
      "67": {
        "price": 10,
        "availability": true,
        "name": "plain white chocolate (2 pcs)"
      },
      "68": {
        "price": 10,
        "name": "plain dark chocolate (2 pcs)",
        "availability": true
      },
      "69": {
        "name": "nutty flavoured filled chocolate (2 pcs)",
        "availability": true,
        "price": 15
      },
      "70": {
        "price": 15,
        "name": "creamy oreo flavoured filled chocolate (2 pcs)",
        "availability": true
      },
      "71": {
        "price": 15,
        "availability": true,
        "name": "shaahi paan flavoured filled chocolate (2 pcs)"
      },
      "72": {
        "availability": true,
        "price": 15,
        "name": "crackle flavoured filled chocolate (2 pcs)"
      },
      "73": {
        "price": 15,
        "availability": true,
        "name": "cranberry flavoured filled chocolate (2 pcs)"
      },
      "74": {
        "availability": true,
        "name": "butterscotch crisp flavoured filled chocolate (2 pcs)",
        "price": 15
      },
      "75": {
        "price": 40,
        "availability": true,
        "name": "Chocolate milkshake"
      },
      "76": {
        "availability": true,
        "name": "Black Current Milkshake",
        "price": 40
      },
      "77": {
        "availability": true,
        "name": "Pack of 20 flavoured chocolates",
        "price": 140
      },
      "78": {
        "availability": true,
        "name": "Pack of 50 flavoured chocolates",
        "price": 360
      },
      "79": {
        "availability": true,
        "name": "Pack of 20 plain chocolates (Get 2 flavoured chocolates free)",
        "price": 99
      }
    },
    "stall-08": {
      "80": {
        "availability": true,
        "name": "Fruit Custard",
        "price": 50
      },
      "81": {
        "availability": true,
        "name": "Cookie Ice-cream Sandwich",
        "price": 60
      },
      "82": {
        "availability": true,
        "name": "Chocolate Brownie Mousse",
        "price": 70
      }
    },
    "stall-09": {
      "90": {
        "availability": true,
        "name": "Plain Dabeli",
        "price": 20
      },
      "91": {
        "availability": true,
        "name": "Chips Dabeli",
        "price": 20
      },
      "92": {
        "availability": true,
        "name": "Cheese Dabeli",
        "price": 30
      },
      "93": {
        "availability": true,
        "name": "MC^3",
        "price": 30
      }
    },
    "stall-10": {
      "100": {
        "availability": true,
        "name": "Veg cheese Pizza square (Jain)",
        "price": 45
      },
      "101": {
        "availability": true,
        "name": "Veg cheese Pizza square",
        "price": 45
      },
      "102": {
        "availability": true,
        "name": "Onion Garlic cheese square",
        "price": 40
      }
    }
  }
  )
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
