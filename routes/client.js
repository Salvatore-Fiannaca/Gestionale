const router = require('express').Router();
const connection = require('../config/database');
const {Client, Work} = connection.models 
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

//      WORKING ON UPDATE CLIENT
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
                    }
            })

        res.redirect('/clients')
    } catch (err) {
        console.log(err);
    }
})
    
router.post('/client_:code', async(req, res) => {
    owner = req.session.passport.user
    let msg = ''
    try {
        const dbClient = await Client.findOneAndDelete({"profile.fiscalCode": req.params.code})
        // ADD OWNER ON WORK SCHEMA
        const dbClientFile = await Work.findOneAndDelete({client: req.params.code, owner: owner})
        msg = "done"
    } catch (err) {
        console.log(err);
        msg = "error"
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
    const filter = await Client.find({owner: owner})
    res.render('pages/show-clients', {clientList: filter, n: 1});
})


module.exports = router;