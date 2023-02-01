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

exports.updatePhone = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only Authenticated User can Submit Orders Update Phone Number"
    );
  }
  if (Math.ceil(Math.log10(data.phone_number + 1)) != 10) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid Phone Number was sent"
    );
  } else {
    getAuth().setCustomUserClaims(context.auth.uid, {
      phone_number: data.phone_number,
    });
  }
});

exports.newOrder = functions.https.onCall(async (data, context) => {
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
      // phone_number: user.customClaims.phone_number,
      name: user.displayName,
    };
    return admin.firestore().collection("orders").add(order);
  }
});

function order_items_formatter(menu_data, data) {
  const formatted_order = {};
  for (let stall_no in data) {
    formatted_order[stall_no] = {};
    const stall_suborder = {};
    for (let item_id in data[stall_no]) {
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
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
