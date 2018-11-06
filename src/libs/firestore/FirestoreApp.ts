import * as firebase from 'firebase-admin';
let ServiceAccount = require('./ServiceAccount.json');
let DatabaseUrl = 'https://cassandra-c8497.firebaseio.com';

let FirestoreApp;
if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(ServiceAccount),
        databaseURL: DatabaseUrl
    });
};
if (!FirestoreApp) {
    let db = firebase.firestore();
    db.settings({ timestampsInSnapshots: true });
    FirestoreApp = db;
};
export default FirestoreApp;