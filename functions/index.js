const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
admin.initializeApp();

// exports.newUserSignup = functions.auth.user().onCreate(user => {
//   return admin.firestore().collection('users').doc(user.uid).set({
//     email: user.email
//   })

// })

// exports.userDeleted = functions.auth.user().onDelete(user => {

//   const doc = admin.firestore().collection('users').doc(user.uid)
//   return doc.delete()
// })

exports.updatePhone = functions.runWith({ enforceAppCheck: true }).https.onCall((data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only Authenticated User can Submit Orders Update Phone Number"
    );
  }
  const regex = new RegExp("[1-9]{1}[0-9]{9}");
  console.log(data);
  if (!regex?.test(data.phoneNumber)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid Phone Number was sent"
    );
  } else {
    getAuth()
      .getUser(context.auth.uid)
      .then((userRecord) => {
        const customClaims = userRecord.customClaims;
        console.log(customClaims);
        console.log(userRecord);
        const newCustomClaim = {
          ...customClaims,
          phoneNumber: data.phoneNumber,
        };
        getAuth().setCustomUserClaims(userRecord.uid, newCustomClaim);
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }
});

exports.addRole = functions.runWith({ enforceAppCheck: true }).https.onCall((data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only Authenticated User can change role"
    );
  }

  if (data?.self === true) {
    getAuth()
      .getUser(context.auth.uid)
      .then((userRecord) => {
        if (context.auth.token.email === "pratham.kamble15754@sakec.ac.in" || context.auth.token.email === "nikhil.pangaonkar15601@sakec.ac.in") {
          const customClaims = userRecord.customClaims;
          const newCustomClaim = { ...customClaims, roles: data.roles };
          getAuth().setCustomUserClaims(userRecord.uid, newCustomClaim);
        } else {
          throw new functions.https.HttpsError(
            "unauthenticated",
            "Only Authenticated User can change rolepra"
          );
        }

      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  } else {
    getAuth()
      .getUser(data.uid)
      .then((userRecord) => {
        const customClaims = userRecord.customClaims;
        const newCustomClaim = { ...customClaims, roles: data.roles };
        getAuth().setCustomUserClaims(userRecord.uid, newCustomClaim);
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }
});

exports.newOrder = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called from an App Check verified app.')
  }
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only Authenticated User can Submit Orders"
    );
  } else {
    const user = await getAuth().getUser(context.auth.token.uid);
    // const user = await admin.firestore().collection('users').doc(context.auth.token.uid).get();
    const menu = await admin
      .firestore()
      .collection("menu")
      .doc("menu_items")
      .get();
    const menu_data = menu.data();
    const order = {};
    order.order_id = random_six_digit_order_id_generator();
    order.order_placed_timestamp = admin.firestore.FieldValue.serverTimestamp();
    order.stall_order = order_items_formatter(menu_data, data);
    order.payment_status = "unpaid";
    order.user_info = {
      email: context.auth.token.email,
      uid: context.auth.token.uid,
      phoneNumber: user.customClaims.phoneNumber,
      name: user.displayName,
    };
    return admin.firestore().collection("orders").add(order);
  }
});

function order_items_formatter(menu_data, data) {
  const formatted_order = {};
  for (const stall_no in data) {
    formatted_order[stall_no] = {};
    const stall_suborder = {};
    for (const item_id in data[stall_no]) {
      if (data[stall_no][item_id] > 15) {
        throw new functions.https.HttpsError(
          "out-of-range",
          "Cannot add more than 15 of same item"
        );
      }
      stall_suborder[item_id] = {
        price: menu_data[stall_no][item_id].price,
        name: menu_data[stall_no][item_id].name,
        qty: data[stall_no][item_id],
      };
    }

    formatted_order[stall_no]["items_ordered"] = stall_suborder;
    formatted_order[stall_no]["status"] = "unpaid";
    // console.log(stall_suborder);
  }
  return formatted_order;
}

function random_six_digit_order_id_generator() {
  const minm = 100000;
  const maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
