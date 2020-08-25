//const { Mongoose } = require("mongoose");

var db = new Mongo().getDB('playground');
db.employees.insert({name: {first: 'Oliver', last: 'Queen'}, age: 54});
db.employees.insert({name: {first: 'Abraham', middle: 'H', last: 'Lincoln'}, age: 74});
db.employees.insert({name: {first: 'Jesus', last: 'Christ'}, age: 44});
db.employees.find();