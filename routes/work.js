const express = require('express')
const router = new express.Router()
const auth = require('../config/auth')
const connection = require('../config/database');
const { Work } = connection.models 
const { ObjectID } = require('mongodb');

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
        "work.status": req.body.status,
        "completed": req.body.status,
        owner: req.user._id
    })
    try {
        await newWork.save()
        res.redirect(`/_${req.params.code}`)
    } catch (e) {
        res.send('ERROR D:', () => console.log(e))
    }
})

router.post('/work_:id', async(req, res) => {
    const dbFile = await Work.findOneAndDelete({_id: ObjectID(req.params.id)})
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
})

router.post('/update-work_:client', auth, async (req, res) => {
    const client = req.params.id
    try {
        await Work.findOneAndUpdate(
            {_client: client}, 
            {$set: {"work.title": req.body.title,
                    "work.folder.title": req.body.folder,
                    "work.folder.number": req.body.nFolder,
                    "work.status": req.body.status,
                    "work.comments": req.body.comments
                    }
            })

        backURL=req.header('Referer') || '/';
        res.redirect(backURL);
    } catch (err) {
        console.log(err);
        backURL=req.header('Referer') || '/';
        res.redirect(backURL);
    }
})



/**
 * -------------- GET ROUTES ----------------
 */

router.get('/_:code', auth, async (req, res) => {
    try {
        const clientList = await Work.find({"client": req.params.code})
        res.render('pages/showForCode', {clientList: clientList, code: req.params.code})
    } catch (e) {
        res.redirect('/clients')
    }
})

router.get('/edit-work_:code', auth, async (req, res) => {
    const clientList = await Work.find({"client": req.params.code})
    console.log(clientList);
    res.render('pages/edit-work', {clientList: clientList})
})

router.get('/new-work_:code', auth, async (req, res) => {
    res.render('pages/new-work', {fiscalCode: req.params.code})
})

module.exports = router
