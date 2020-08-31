const router = require('express').Router();
const connection = require('../config/database');
const {Client, Work, Upload, UploadWork, Count} = connection.models 
const auth = require('../config/auth');
const fs = require('fs');

/**
 * -------------- POST ROUTES ----------------
 */

//      ADD NEW CLIENT
router.post('/client', auth, async (req, res) => {
    const code = req.body.fiscalCode
    const check = await Client.find({ owner: req.user._id, "profile.fiscalCode": code})

    // CHECK IF EXIST
    if (!check[0]) {
        
        const counter = await Count.findOneAndUpdate({owner: req.user._id}, {$inc: {count: +1} })
        try {
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
                owner: req.user._id,
                count: counter.count
            })
            await newClient.save()
        } catch (e) {
            console.log(e)
        }
        res.redirect(`/upload_${code}`)

    } else {
        res.render(`pages/clients`, {redMsg: true, text: 'Codice Fiscale già registrato'})
    }
    
})
   
//      UPDATE CLIENT
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
                    "archive": req.body.archive
                    }
            })
        res.redirect('/clients')
    } catch (err) {
        console.log(err);
    }
})

// DELETE CLIENT
router.post('/client_:code', async(req, res) => {
    owner = req.session.passport.user
    try {
        await Client.findOneAndDelete({"profile.fiscalCode": req.params.code, owner: owner})
        await Work.deleteMany({client: req.params.code, owner: owner})
        const findWork = await UploadWork.find({client: req.params.code, owner: owner})
        const findUpload = await Upload.find({client: req.params.code, owner: owner})
        
        // DELETE UPLOAD CLIENT
        await Upload.deleteMany({client: req.params.code, owner: owner})
        findUpload.forEach(file => {
            let path = file.path
            fs.unlink(path, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })

        // DELETE UPLOAD WORK CLIENT
        await UploadWork.deleteMany({client: req.params.code, owner: owner})
        findWork.forEach(file => {
            let path = file.path
            fs.unlink(path, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        })

    } catch (err) {
        console.log(err);
    }
    res.redirect("/clients")
})

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/client', auth, (req, res) => {
    res.render('pages/clients', {redMsg: false});
})

router.get('/edit-client_:id', auth, async (req, res) => {
    owner = req.session.passport.user
    const client = await Client.find({owner: owner, _id: req.params.id})
    res.render('pages/edit-client', {clientList: client, n: 1});
})

router.get('/clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner, "archive": false})
    const counter = await Count.find({owner: req.user._id})
    res.render('pages/show-clients', {clientList: filter, count: counter[0].count });
})

router.get('/old-clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner, "archive": true })
    res.render('pages/show-old', {clientList: filter, n: 1});
})

module.exports = router;