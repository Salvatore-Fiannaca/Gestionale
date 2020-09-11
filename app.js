const express = require("express");
const favicon = require("serve-favicon")
const path = require('path')

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- ROUTES ----------------
 */

const routes = require("./routes");
const clientRoutes = require("./routes/client");
const workRoutes = require("./routes/work");
const uploadRoutes = require("./routes/upload");
const uploadWorkRoutes = require("./routes/uploadWork");
const forgotRoutes = require("./routes/forgot");
const linkRoutes = require("./routes/link");

app.use(routes);
app.use(clientRoutes);
app.use(workRoutes);
app.use(uploadRoutes);
app.use(uploadWorkRoutes);
app.use(forgotRoutes);
app.use(linkRoutes);



/**
 * -------------- SERVER ----------------
*/

const port = process.env.PORT || 3000

// setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Static route
app.use(express.static("public"));
// Favicon
app.use(favicon(path.join(__dirname,'public','img','logo.png')));

app.listen(port, () => console.log(`Server is up on port ${port}`));

app.use(function(req, res, next) {
  res.status(404).render('pages/404');
});
