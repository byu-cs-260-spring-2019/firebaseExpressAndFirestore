const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);
const app = express();

var db = firebase.firestore();
var ticketsRef = db.collection('tickets');
        
app.get('/api/tickets', async (req,res) => {
    let querySnapshot = await ticketsRef.get();
    res.send(querySnapshot.docs.map(doc => doc.data()));
});

app.post('/api/tickets', async (req, res) => {
    let querySnapshot = await ticketsRef.get();
    let numRecords = querySnapshot.docs.length;

    let ticket = {
        id: numRecords + 1,
        name: req.body.name,
        problem: req.body.problem
      };
  
    ticketsRef.doc(ticket.id.toString()).set(ticket);
    res.send(ticket);
});

app.delete('/api/tickets/:id', async (req,res) => {
    let id = req.params.id.toString();
    var documentToDelete = ticketsRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that ticket doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
});


exports.app = functions.https.onRequest(app);
