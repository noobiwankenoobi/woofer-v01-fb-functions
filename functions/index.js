const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require("cors");

admin.initializeApp();

const express = require('express');
const app = express();

app.use(cors({ origin: true }));


//////////
// GET // Woofs
//////////////
app.get('/woofs', (req, res) => {
  admin
    .firestore()
    .collection('woofs')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let woofs = [];
      data.forEach((doc) => {
        woofs.push({
          woofId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(woofs);
    })
    .catch((err) => console.error(err));
});

///////////
// POST // a woof
////////////////
app.post('/woof', (req, res) => {
  const newWoof = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin.firestore()
    .collection('woofs')
    .add(newWoof)
    .then((doc) => {
      let responseFromPost = {
        message: `document ${doc.id} created successfully`,
        statusMessage: "success",
        createdWoofId: doc.id
      }
      res.json(responseFromPost)
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});



exports.api = functions.https.onRequest(app);
