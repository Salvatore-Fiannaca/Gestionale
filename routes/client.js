const express = require('express')
const router = new express.Router()
const auth = require('../config/auth')
const connection = require('../config/database');
const {Client} = connection.models 

// POST
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
        //res.send("OK")
        res.redirect(`/upload_${code}`)
        //res.render('pages/edit-client',{newClient: newClient })
        } catch (e) {
         console.log(e)
    }

  })


// GET
router.get('/client', auth, (req, res) => {
    res.render('pages/clients');
})
router.get('/clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner})
    res.render('pages/show-clients', {clientList: filter, n: 1});
})  
  module.exports = router