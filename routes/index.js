const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const User = connection.models.User;
const Client = connection.models.Client;
const auth = require('../middleware/auth')


/**
 * -------------- POST ROUTES ----------------
 */

 router.post('/login', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/'}))

 router.post('/register', async (req, res) => {
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

 router.post('/client', auth, async (req, res) => {
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

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('pages/index');
    } else {
        res.render('pages/login');
    }
});

router.get('/register', (req, res) => {
    res.render('pages/register')
})

router.get('/logout', auth, async(req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/forgot', (req, res) => {
    res.render('pages/forgot')
})

router.get('/client', auth, (req, res) => {
        res.render('pages/clients');
})

router.get('/clients/:id', auth, async (req, res) => {
    //const _id = req.params.id
    try {
        const client = await Client.findOne({_id: "5f38f01c35619b3d1d091641"})
    } catch (e) {
        console.log(e)
    }
    res.render('pages/show-clients');
})

router.get('/clients', auth, async (req, res) => {
    //Manual setting owner
    owner = "5f38f01c35619b3d1d091641"
    const filter = await Client.find({owner: owner})
    res.render('pages/show-clients', {clientList: filter});
})

router.get('/practice', auth, (req, res) => {
    res.render('pages/practice')
})

router.get('/practices', auth, async (req, res) => {
    const clientList = await Client.find()
    res.render('pages/show-practices', {clientList: clientList});
})

router.get('/404', (req, res) => {
    res.render('pages/404')
})


module.exports = router;

