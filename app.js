// Frontend     (localhost:3000)
const path = require('path')
const express = require('express')
const session = require('express-session')
var passport = require('passport');
var routes = require('./routes');
const ejs = require('ejs')
const connection = require('./config/database');

const MongoStore = require('connect-mongo')(session);

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day * 24/hr/1day * 60min/1 hr
    }
}))

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

// OLD STATIC ROUTES
/*
app.get('/', (req, res) => {

    if(req.session.views) {
        req.session.views++
        res.redirect('/dashboard')
    } else {
        req.session.view = 1;
        res.render('pages/login')
    }

})

app.get('/dashboard', (req, res) => {
    res.render('pages/index', {
        title: ''
    })
})

app.post('/login', (req, res) => {
    sess = req.session;
    sess.email = req.body.email;
    res.render('pages/index', {
        title: ''
    })
})

app.get('/register', (req, res) => {
    res.render('pages/register', {
        title: ''
    })
})

app.get('/forgot', (req, res) => {
    res.render('pages/forgot', {
        title: ''
    })
})

app.get('/clients', (req, res) => {
    res.render('pages/clients', {
        title: ''
    })
})

app.get('/practices', (req, res) => {
    res.render('pages/practices', {
        title: ''
    })
})



    app.get('/about', (req, res) => {
        res.render('about', {
            title: 'About Me',
            name: 'Salvatore'
        })
    })

    app.get('/help', (req, res) => {
        res.render('help', {
            title: 'Help page',
            helpText: '...',
            name: 'Salvatore'
        })
    })



    app.get('/products', (req, res) =>{
        if (!req.query.search) {
            return res.send({
                error: 'You must provide a search term'
            })
        }
        console.log(req.query.search);
        res.send({
            products: []
        })

    })


    app.get('/help/*', (req, res) => {
        res.render('404', {
            title: "404",
            name: "Salvatore",
            errorMessage: "Help article not found."
        })
    })



app.get('*', (req, res) => {
    res.render('pages/404', {
        title: "404",
        name: "Salvatore",
        errorMessage: "Page not found."
    })
  })

*/

/**
 * -------------- SERVER ----------------
 */

// setting view engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Static route
app.use(express.static('public'))




app.listen(3000, () => console.log('Server is up on :3000'))
