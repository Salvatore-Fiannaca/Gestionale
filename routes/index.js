const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
 router.post('/login', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/'}))

 // TODO
 router.post('/register', async (req, res, next) => {
   const hash =  await genPassword(req.body.password)

   const newUser = new User({
       username: req.body.username,
       hash: hash
   })

   newUser.save()
     .then((user) => {
         console.log("Account amministratore creato con successo")
     })
   res.redirect('/')
 })


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.render('pages/index');
    } else {
        res.render('pages/login');
    }
});


// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {
    res.render('pages/register')
})

// Visiting this route logs the user out
router.get('/logout', async(req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/clients', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.render('pages/clients');
    } else {
        res.redirect('/');
    }
})

/* router.get('/moduli', (req, res, next) => { 
        res.render('pages/clients')
}) */


module.exports = router;
