const router = require('express').Router();
const connection = require('../config/database');
const {Client, Work, Upload, UploadWork} = connection.models 
const auth = require('../config/auth');
const { readSync } = require('fs');

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
        owner: req.user._id
    })
    try {
        await newClient.save()
        res.redirect(`/upload_${code}`)
        } catch (e) {
         console.log(e)
    }
})

router.post('/update_:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        await Client.findOneAndUpdate(
            {_id: id, owner: req.user._id}, 
            {$set: {"profile.firstName": req.body.firstName,
                    "profile.lastName": req.body.lastName,
                    "address.street": req.body.address,
                    "address.city": req.body.city,
                    "address.state": req.body.state,
                    "address.zipCode": req.body.zipCode,
                    "contacts.email": req.body.email,
                    "contacts.phone": req.body.phone,
                    "completed": req.body.completed
                    }
            })
        res.redirect('/clients')
    } catch (err) {
        console.log(err);
    }
})

// DELETE ALL FOR CLIENT
router.post('/client_:code', async(req, res) => {
    owner = req.session.passport.user
    try {
        await Client.findOneAndDelete({"profile.fiscalCode": req.params.code})
        await Work.deleteMany({client: req.params.code, owner: owner})
        await Upload.deleteMany({client: req.params.code, owner: owner})
        await UploadWork.deleteMany({client: req.params.code, owner: owner})
    } catch (err) {
        console.log(err);
    }
    res.redirect("/clients")
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
    res.render('pages/edit-client', {clientList: client, n: 1});
})

router.get('/clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner, "completed": false})
    res.render('pages/show-clients', {clientList: filter, n: 1 });
})

router.get('/old-clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner, "completed": true })
    res.render('pages/show-old', {clientList: filter, n: 1});
})

module.exports = router;