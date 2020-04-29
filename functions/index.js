const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


exports.getWoofs = functions.https.onRequest((req, res) => {
  admin.firestore().collection('woofs').get()
    .then((data) => {
      let woofs = [];
      data.forEach((doc) => {
        woofs.push(doc.data());
      });
      return res.json(woofs)
    })
    .catch((err) => console.error(err));
});

