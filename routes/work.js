const express = require('express')
const router = new express.Router()
const auth = require('../config/auth')
const connection = require('../config/database');
const { Work, Client } = connection.models 

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/new-work_:code', auth, async (req, res) => {
    const newWork = await new Work({
        "client": req.params.code,
        "work.title": req.body.title,
        "work.folder.title": req.body.folder,
        "work.folder.number": req.body.nFolder,
        "work.comments": req.body.comments,
        "work.file.title": req.body.titleFile,
        "work.file.link": req.body.linkFile,
        "work.status": req.body.status
    })
    try {
        await newWork.save()
        res.send('OK!')
    } catch (e) {
        res.send('ERROR D:', () => console.log(e))
    }
})



/**
 * -------------- GET ROUTES ----------------
 */


router.get('/practice', auth, (req, res) => {
    res.render('pages/practice')
})

router.get('/_:code', auth, async (req, res) => {
    code = req.params.code 
    try {
        const clientList = await Work.find({"client": code})
        //console.log(clientList[0])
        res.render('pages/showForCode', {clientList: clientList});
    } catch (e) {
        console.log(e)
        res.send('User not found')
    }
})

router.get('/new-work_:code', auth, async (req, res) => {
    res.render('pages/new-work', {fiscalCode: req.params.code})
})

router.get('/practices', auth, async (req, res) => {
    owner = req.session.passport.user
    const clientList = await Client.find({owner: owner})
    res.render('pages/show-practices', {clientList: clientList});
})

module.exports = router
