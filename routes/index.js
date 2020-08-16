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
        "profile.firstName": req.body.firstName,
        "profile.lastName": req.body.lastName,
        "profile.fiscalCode": req.body.fiscalCode,
        "address.street": req.body.address,
        "address.city": req.body.city,
        "address.state": req.body.state,
        "address.zipCode": req.body.zipCode,
        "contacts.email": req.body.email,
        "contacts.phone": req.body.phone,
        ...req.body,
        owner: req.user._id,
    })

    try {
        await newClient.save()
        res.redirect('/clients')
        } catch (e) {
         console.log(e)
    }
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

router.get('/clientx', async (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        console.log(req.user._id)
        try {
            const client = await Client.findOne({_id: "5f380a594147b1186f35304d"})
            console.log(client)

        } catch (e) {
            console.log(e)
        }
        res.render('pages/index');
    } else {
        res.redirect('/');
    }
})

router.get('/clients', async (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        const clientList = await Client.find()
        res.render('pages/show-clients', {clientList: clientList});
    } else {
        res.redirect('/');
    }
})

router.get('/practice', (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        res.render('pages/practice');
    } else {
        res.redirect('/');
    }
})

router.get('/practices', async (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        const clientList = await Client.find()
        res.render('pages/show-practices', {clientList: clientList});
    } else {
        res.redirect('/');
    }
})

router.get('/404', (req, res, next) => {
    res.render('pages/404')
})


module.exports = router;

