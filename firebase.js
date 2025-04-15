// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_notification_servicekey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
