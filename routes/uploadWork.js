const express = require('express')
const router = new express.Router()
const auth = require('../config/auth')
const upload = require('../config/multer')
const fixString = require('../utils/fixString')
const connection = require('../config/database');
const { UploadWork } = connection.models
const fs = require('fs');
const { ObjectID } = require('mongodb');


/**
 * -------------- POST ROUTES ----------------
 */

// ADD NEW 
router.post('/work-upload_:code', auth, upload, async (req, res) => {
    const files = req.files
    if (files) {
        files.forEach(file => {
            const path = fixString(file.path)
            const newFile = new UploadWork({
                "client": req.params.code,
                "fieldname": file.fieldname,
                'originalname': file.originalname,
                "mimetype": file.mimetype,
                "destination": file.destination,
                "filename": file.filename,
                "path": path,
                "size": file.size,
                "owner": req.user._id
            })
            try {
                newFile.save()
            } catch (e) {
                console.log(e);
            }
        })
    }
    res.redirect(`/clients`)
})

//          DELETE WORK UPLOAD
router.post('/work-file_:id', async (req, res) => {
    try {
        const localfile = await UploadWork.find({ _id: ObjectID(req.params.id) })
        const path = localfile[0].path
        await UploadWork.findOneAndDelete({ _id: ObjectID(req.params.id) })

        fs.unlink(path, (err) => {
            if (err) {
                console.log(err)
                res.redirect(req.header('Referer') || '/')
            }
        })
    } catch (err) {
        console.log(err);
        res.redirect(req.header('Referer') || '/')
    }
    res.redirect('/clients')


})

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/work-upload_:code', auth, upload, async (req, res) => {
    res.render('pages/upload-work', { code: req.params.code })
})

router.get('/work-show-upload_:code', auth, async (req, res) => {
    try {
        const clientList = await UploadWork.find({ client: req.params.code })
        console.log(clientList);
        res.render('pages/show-Work-Upload', { clientList: clientList, code: req.params.code });
    } catch (err) {
        console.log(err)
        res.redirect(req.header('Referer') || '/')
    }
})

router.get('/work-file_:id', async (req, res) => {

    const dbFile = await UploadWork.find({ _id: ObjectID(req.params.id) })
    const path = "/home/jil/Desktop/Gestionale/" // INSERISCI IL MODIFICARE
    //const path = "/home/jil/Dev/Gestionale/" // CARTELLA PROGETTO

    if (dbFile) {
        const file = path + dbFile[0].path
        fs.access(file, fs.constants.F_OK, err => {
            console.log(`${file} ${err ? "does not exist" : "exists"}`);
        })
        fs.readFile(file, (err, content) => {
            if (err) {
                res.writeHead(404, { "Content-type": "text/html" })
            }
            else {
                res.writeHead(200, { "Content-type": dbFile[0].mimetype })
                res.end(content)
            }
        })
    } else {
        res.redirect(req.header('Referer') || '/')
    }
})



module.exports = router