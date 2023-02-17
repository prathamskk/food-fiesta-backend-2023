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
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
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

export function updateMenu() {
  const MENU_DOC_ID = "menu_items";
  const MENU_COLLECTION_ID = "menu";
  const { firestore } = getFirebase();
  const menuCol = collection(firestore, MENU_COLLECTION_ID);
  const menuDoc = doc(menuCol, MENU_DOC_ID);
  setDoc(menuDoc, {
    "stall-01": {
      "20": {
        "availability": true,
        "name": "chocolate sandwich",
        "price": 40
      },
      "21": {
        "price": "40",
        "name": "chocolate sandwich with ice cream",
        "availability": true
      },
      "22": {
        "availability": true,
        "price": 40,
        "name": "chocolate milkshake"
      },
      "23": {
        "availability": true,
        "name": " blueberry milkshake",
        "price": 40
      },
      "24": {
        "price": "40",
        "name": "chocolate milkshake with ice cream",
        "availability": true
      },
      "25": {
        "availability": true,
        "price": 70,
        "name": "chocolate sandwich (combo)"
      },
      "26": {
        "availability": true,
        "price": 100,
        "name": "chocolate sandwich with ice cream (combo)"
      }
    },
    "stall-02": {
      "10": {
        "price": 35,
        "availability": true,
        "name": "grilled sandwich"
      },
      "11": {
        "availability": true,
        "price": 49,
        "name": "grilled cheese sandwich"
      },
      "12": {
        "availability": true,
        "name": "bahubali sandwich",
        "price": 99
      },
      "13": {
        "name": "schezwan fried rice (half)",
        "availability": true,
        "price": 35
      },
      "14": {
        "price": 49,
        "name": "schezwan fried rice (full)",
        "availability": true
      },
      "15": {
        "availability": true,
        "price": 89,
        "name": "grilled cheese sandwich + schezwan fried rice"
      }
    },
    "stall-03": {
      "30": {
        "availability": true,
        "name": "green apple sparkle",
        "price": 60
      },
      "31": {
        "price": 50,
        "name": "blue sparkle",
        "availability": true
      },
      "32": {
        "name": "virgin mojito",
        "price": 50,
        "availability": true
      }
    },
    "stall-04": {
      "38": {
        "price": 40,
        "availability": true,
        "name": "salted twister's"
      },
      "39": {
        "price": 50,
        "name": "peri-peri twister's",
        "availability": true
      },
      "40": {
        "price": 50,
        "name": "chatpatta twister's",
        "availability": true
      },
      "41": {
        "name": "mayonnaise twister's",
        "availability": true,
        "price": 60
      },
      "42": {
        "price": 60,
        "name": "cheesy twister's",
        "availability": true
      },
      "43": {
        "price": 80,
        "availability": true,
        "name": "DP's special twister's"
      },
      "44": {
        "availability": true,
        "price": 40,
        "name": "salted french-fries"
      },
      "45": {
        "price": 50,
        "availability": true,
        "name": "peri-peri french-fries"
      },
      "46": {
        "availability": true,
        "name": "chatpatta french-fries",
        "price": 50
      },
      "47": {
        "name": "mayonnaise french-fries",
        "price": 60,
        "availability": true
      },
      "48": {
        "price": 60,
        "availability": true,
        "name": "cheesy french-fries"
      },
      "49": {
        "price": 80,
        "name": "DP's special french-fries",
        "availability": true
      }
    },
    "stall-05": {
      "50": {
        "availability": true,
        "price": 30,
        "name": "chocolate brownies (1 pcs)"
      },
      "51": {
        "name": "strawberryBlondie brownies (1 pcs)",
        "price": 50,
        "availability": true
      },
      "52": {
        "name": "nutella brownies (1 pcs)",
        "price": 50,
        "availability": true
      },
      "53": {
        "name": "Ferrero Rocher brownies (1 pcs)",
        "availability": true,
        "price": 65
      },
      "54": {
        "name": "brownies with ice-cream (1 pcs)",
        "availability": true,
        "price": 55
      },
      "55": {
        "price": 40,
        "name": "chocolate mousse cupcakes (1 pcs)",
        "availability": true
      },
      "56": {
        "price": 50,
        "name": "chocolate ganche cupcakes (1 pcs)",
        "availability": true
      },
      "57": {
        "availability": true,
        "price": 25,
        "name": "choco-chips (2 pcs)"
      },
      "58": {
        "name": "choco-chips (5 pcs)",
        "price": 50,
        "availability": true
      },
      "59": {
        "name": "chocolate cake jars (1 pcs)",
        "availability": true,
        "price": 40
      },
      "60": {
        "price": 50,
        "availability": true,
        "name": "red velvet cake jars (1 pcs)"
      },
      "61": {
        "availability": true,
        "name": "biscof cake jars (1 pcs)",
        "price": 60
      },
      "62": {
        "name": "chocolate cake jars (2 pcs)",
        "availability": true,
        "price": 70
      },
      "63": {
        "price": 90,
        "name": "red velvet cake jars (2 pcs)",
        "availability": true
      },
      "64": {
        "availability": true,
        "price": 110,
        "name": "biscof cake jars (2 pcs)"
      },
      "65": {
        "name": "almond brittle (1 pcs)",
        "price": 25,
        "availability": true
      },
      "66": {
        "name": "almond brittle (2 pcs)",
        "price": 45,
        "availability": true
      }
    },
    "stall-06": {
      "70": {
        "price": 40,
        "name": "cheesy desi tacos",
        "availability": true
      },
      "71": {
        "price": 35,
        "availability": true,
        "name": "mixed fruit custard"
      },
      "72": {
        "availability": true,
        "name": "thanda masala chaas",
        "price": 15
      },
      "73": {
        "name": "try your luck on combos",
        "availability": true,
        "price": 60
      }
    },
    "stall-07": {
      "80": {
        "price": 20,
        "availability": true,
        "name": "water pav"
      },
      "81": {
        "price": 25,
        "name": "water sandwich",
        "availability": true
      },
      "82": {
        "name": "mayo sandwich",
        "availability": true,
        "price": 30
      },
      "83": {
        "price": 40,
        "name": "oreo milkshake",
        "availability": true
      }
    },
    "stall-08": {
      "90": {
        "name": "oreo mousse",
        "price": "30",
        "availability": true
      },
      "91": {
        "availability": true,
        "price": 30,
        "name": "blueberry moussse"
      },
      "92": {
        "availability": true,
        "name": "coffee mousse",
        "price": 30
      },
      "93": {
        "price": 30,
        "name": "strawberry mousse",
        "availability": true
      },
      "94": {
        "name": "cakepop's",
        "price": 15,
        "availability": true
      }
    },
    "stall-09": {
      "100": {
        "price": 20,
        "name": "pani puri",
        "availability": true
      },
      "101": {
        "price": 15,
        "availability": true,
        "name": "pav bhaji baveli"
      }
    },
    "stall-10": {
      "110": {
        "availability": true,
        "name": "Delhi kurkure canapes",
        "price": 30
      },
      "111": {
        "availability": true,
        "name": "jain special canapes",
        "price": 30
      },
      "112": {
        "availability": true,
        "name": "chocolicious mer chilli mili canapes",
        "price": 35
      },
      "113": {
        "availability": true,
        "name": "Plain chocolates (1 Pcs)",
        "price": 5
      },
      "114": {
        "availability": true,
        "name": "milk chocolates (1 Pcs)",
        "price": 5
      },
      "115": {
        "availability": true,
        "name": "white chocolates (1 Pcs)",
        "price": 5
      },
      "116": {
        "availability": true,
        "name": "dark chocolates (1 Pcs)",
        "price": 5
      }
    },
    "stall-11": {
      "120": {
        "availability": true,
        "name": "Nimbu Pani",
        "price": 15
      },
      "121": {
        "availability": true,
        "name": "jNimbu soda",
        "price": 25
      }
    },
    "stall-12": {
      "130": {
        "availability": true,
        "name": "Chinese Bhel",
        "price": 20
      }
    }
  })
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
