const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const User = connection.models.User;
const Client = connection.models.Client;


/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/'}))

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

 router.post('/client', async (req, res, next) => {
    const newClient = await new Client({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        fiscalCode: req.body.fiscalCode,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        email: req.body.email,
        phone: req.body.phone
    })
    console.log(newClient)
 
    newClient.save()
      .then((user) => {
          console.log("Cliente aggiunto con successo")
      })
    res.redirect('/client')
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

router.get('/client', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.render('pages/clients');
    } else {
        res.redirect('/');
    }
})

router.get('/clients', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.render('pages/show-clients');
    } else {
        res.redirect('/');
    }
})

router.get('/404', (req, res, next) => {
    res.render('pages/404')
})


module.exports = router;
