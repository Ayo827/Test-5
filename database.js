//const { Mongoose } = require("mongoose");

// var db = new Mongo().getDB('playground');
// db.employees.insert({name: {first: 'Oliver', last: 'Queen'}, age: 54});
// db.employees.insert({name: {first: 'Abraham', middle: 'H', last: 'Lincoln'}, age: 74});
// db.employees.insert({name: {first: 'Jesus', last: 'Christ'}, age: 44});
// db.employees.find();
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost/playground',{useUnifiedTopology: true}, (err, client) => 
    {
        const db = client.db('playground');
        db.collection('employees').insertOne({name: {first: 'Oliver', last: 'Queen'}, age: 54});
        db.collection('employees').find().toArray(function(err, doc){
        console.log('Results in: ', doc);
       // db.close();
    });
});