var admin = require("firebase-admin");

var serviceAccount = require("../sistema-de-alarmas-web-firebase-adminsdk-91a6i-ca47e20f27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sistema-de-alarmas-web-default-rtdb.firebaseio.com"
});

module.exports = admin 