// Here is where we import modules
// dependencies
const dotenv = require("dotenv"); // require package
// We begin by loading Express
const express = require('express');
const mongoose = require("mongoose"); // require package, so we can use it to connect to our database
// Import the Fruit model
const Fruit = require("./models/fruit.js"); // according to Dan, expert, NOT GA;  
// this require happens after we establish a connection to our MongoDB instance.

// initialize the express application
const app = express();

// config code
dotenv.config(); // Loads the environment variables from .env file, Dan like it here under dependencies


// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);

//basely like a event handler according to Dan,
// aka Mongoose/MongDB event listener
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

//   mount middleware functions here

// body parser middleware: this function reads the request body
// and decodes it into req.body so we can access form data!
app.use(express.urlencoded({ extended: false }));
// Dan never need to turn it off, the  "false"

// GET /
// Root path/route "HomePage"
app.get("/", async (req, res) => {
    // res.send("hello, friend!");
    // allows us to render our EJS template as HTML
    res.render("index.ejs");

  });

  // path to the page with a form we can fill out
  // and submit to add anew fruit to the database
// GET /fruits/new
app.get("/fruits/new", (req, res) => {
    // res.send("This route sends the user a form page!");
    // never add a trailing slash with render!

    res.render("fruits/new.ejs"); //<-- relative file path

  });

// Path used to receive form submissions
// POST /fruits
app.post("/fruits", async (req, res) => {
    // conditional logic to handle the 
    // default behavior of HTML form checkbox fields
    // we do this when we need a boolean instead of a string
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
      } else {
        req.body.isReadyToEat = false;
      }
    // create the data in our database
    await Fruit.create(req.body);
    console.log(req.body);
    // redirect tells the client to navigate to 
    // a new URL path/another page
    // no template engineer, make client ...
    
    res.redirect("/fruits/new"); //<--  URL  path!
  });

// GET /fruits
// index route for fruits - sends a page that lists
// all fruits from the database
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    console.log(allFruits);
    // res.send("Welcome to the index page"); // will cause error if send and render at the same time
    //pass to render a context object, gives the page the information it needs
    res.render("fruits/index.ejs", {fruits: allFruits});
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
