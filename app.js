const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connection = require("./config/database");
const MongoStore = require("connect-mongo")(session);
const favicon = require("serve-favicon")
const path = require('path')

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

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
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day * 24/hr/1day * 60min/1 hr
    },
  })
);

//  CSRF PROTECTION
/*
const cookieParser = require('cookie-parser')
const csrf = require("csurf")
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser())
*/

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

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
const invalidCsrfToken = require("./config/csrf");

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

// setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Static route
app.use(express.static("public"));
// Favicon
app.use(favicon(path.join(__dirname,'public','img','logo.png')));

app.listen(3000, () => console.log("Link Server => http://localhost:3000/login"));

app.use(function(req, res, next) {
  res.status(404).render('pages/404');
});

//app.use(invalidCsrfToken)
