// Here is where we import modules
// dependencies
const dotenv = require("dotenv"); // require package
// We begin by loading Express
const express = require('express');
const mongoose = require("mongoose"); // require package, so we can use it to connect to our database
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

// new code below this line
const path = require("path");



// Import the Fruit model
const Fruit = require("./models/fruit.js"); // according to Dan, expert, NOT GA;  
// this require happens after we establish a connection to our MongoDB instance.

// initialize the express application
const app = express();

// now I can use use app.use
// static asset middleware - used to sent static assets ()
//  new code below this line 
//  app.use(express.static(path.join(__dirname, "public")));  //for older version &if in the root no need to have that path
app.use(express.static('public'));

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
// Mount it along with our other middleware, ABOVE the routes

app.use(methodOverride("_method")); // new
// method override reads the "_method" query param for
// DELETE or PUT requests
// app.use(morgan("dev")); //new


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
    // if (req.body.isReadyToEat === "on") {
    //     req.body.isReadyToEat = true;
    //   } else {
    //     req.body.isReadyToEat = false;
    //   }
    req.body.isReadyToEat = !!req.body.isReadyToEat;
    // create the data in our database
    await Fruit.create(req.body);
    console.log(req.body);
    // redirect tells the client to navigate to 
    // a new URL path/another page
    // no template engineer, make client ...

    // res.redirect("/fruits/new"); //<--  URL  path!
    res.redirect("/fruits"); //<--  URL  path!

});

// GET /fruits
// index route for fruits - sends a page that lists
// all fruits from the database
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find({});
    console.log(allFruits);
    // res.send("Welcome to the index page"); // will cause error if send and render at the same time
    //pass to render a context object, gives the page the information it needs
    res.render("fruits/index.ejs", { fruits: allFruits });
});


// SHOW
app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    // res.send(
    //     `This route renders the show page for fruit id: ${req.params.fruitId}!`
    //   );
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

// delete route, once matched by server.js, sends a 
// action to MongDB to delete a document using it's id to find and delelte it
app.delete("/fruits/:fruitId", async (req, res) => {
    // res.send("This is the delete route");

    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits"); //why redirect, for ui purpose
});


// edit route - used to send a page to the client with
// an edit form pre-filled out with fruit details
// so ther user can edit the fruit and submit the form
// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    // 1 . look up the fruit by it's id
    const foundFruit = await Fruit.findById(req.params.fruitId);
    console.log(foundFruit);
    // 2. respond with a "edit" template with an edit form
    // res.send(`This is the edit route for ${foundFruit.name}`);
    res.render("fruits/edit.ejs", {
        fruit: foundFruit,
    });
  });
  

  // server.js
// update route -used to capture edit form submissions
// from the client and send updates to MongoDB
app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });
  

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
