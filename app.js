const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connection = require("./config/database");
const MongoStore = require("connect-mongo")(session);

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

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

const routes = require("./routes");
const routes404 = require("./routes/404");
const clientRoutes = require("./routes/client");
const workRoutes = require("./routes/work");
const uploadRoutes = require("./routes/upload");
const uploadWorkRoutes = require("./routes/uploadWork");
const forgot = require("./routes/forgot");

app.use(routes);
app.use(routes404);
app.use(clientRoutes);
app.use(workRoutes);
app.use(uploadRoutes);
app.use(uploadWorkRoutes);
app.use(forgot);

/**
 * -------------- SERVER ----------------
 */

// setting view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Static route
app.use(express.static("public"));

app.listen(3000, () => console.log("Server is up on :3000"));
