const router = require('express').Router();
const connection = require('../config/database');
const {Client} = connection.models 
const auth = require('../config/auth')

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/client', auth, async (req, res) => {
    const code = req.body.fiscalCode
    const newClient = await new Client({
        "profile.firstName": req.body.firstName,
        "profile.lastName": req.body.lastName,
        "profile.fiscalCode": code,
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
        res.redirect(`/upload_${code}`)
        } catch (e) {
         console.log(e)
    }

  })

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/client', auth, (req, res) => {
    res.render('pages/clients');
})

router.get('/edit-client_:id', auth, async (req, res) => {
    owner = req.session.passport.user
    const client = await Client.find({owner: owner, _id: req.params.id})
    console.log(client);
    res.render('pages/edit-client', {clientList: client, n: 1});
})

router.get('/clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner})
    res.render('pages/show-clients', {clientList: filter, n: 1});
})


module.exports = router;