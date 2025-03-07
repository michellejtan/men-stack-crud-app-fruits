// import the mongoose library 
const mongoose = require("mongoose");
// define our fruit model
const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
  });

// first argument the name of our model: "Fruit"
// our model base off: fruitSchema
// convention to use capital letter for database model names
//  inform Mongoose about the collection in MongoDB that will use this schema for its documents, so create model
  const Fruit = mongoose.model("Fruit", fruitSchema); // create model
// models/fruit.js

module.exports = Fruit;
// this module  exports the fruit model.
// the fruit model provides us with full-CRUD
// functionality over our fruits collection
//in the fruits-app database
// so the rest of our application has access to it