const express = require('express')
const router = new express.Router()
const auth = require('../config/auth')
const upload = require('../config/multer')
const connection = require('../config/database');
const {Upload } = connection.models 
const fs = require('fs');
const { ObjectID } = require('mongodb');

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/upload_:code', auth, upload, async (req, res) => {
    const client = req.params.code
    // CHECK FILE
    const files = req.files

    const removeEmptySpace = (str) => {
        // pulisci
        let firstPass = str.replace(' ', '-')
        let secondPass = firstPass.replace(' ', '-')
        let thirdPass = secondPass.replace(' ', '-')
        let fourthPass = thirdPass.replace(' ', '-')
        // ritorna stringa pulita
        return fourthPass
    }

    files.forEach(file => {
        const path = removeEmptySpace(file.path)
        const newFile = new Upload({
            "client": client,
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

    res.redirect('/clients')
       
})

router.post('/file_:id', async(req, res) => {
    try {
        //const localfile = await Upload.find({_id: ObjectID(req.params.id)})
        const localfile = await Upload.findOneAndDelete({_id: ObjectID(req.params.id)})
        const path = localfile.path

        fs.unlink( path, (err) => {
            if (err) {
                console.log(err)
                res.redirect(req.header('Referer') || '/');
            }
            else {
                res.redirect(req.header('Referer') || '/');
            }
        })
    } catch (err) {
        console.log(err);
        res.redirect(req.header('Referer') || '/');
    }
    
    
})

/**
 * -------------- GET ROUTES ----------------
 */


router.get('/upload_:code', auth, upload, async (req, res) => {
    const client = req.params.code
    res.render('pages/upload-client', {code: client})
})


router.get('/show-upload_:code', auth, async (req, res) => {
    try {
        const clientList = await Upload.find({client: req.params.code })
        res.render('pages/showUpload', {clientList: clientList, code: req.params.code});
    } catch (e) {
        console.log(e)
        res.send('User not found')
    }
})


router.get('/file_:id', async(req, res) => {

    const dbFile = await Upload.find({_id: ObjectID(req.params.id)})
    const path = "/home/jil/Desktop/Gestionale/" // INSERISCI IL MODIFICARE
    //const path = "/home/jil/Dev/Gestionale/" // CARTELLA PROGETTO
    const file = path + dbFile[0].path
    fs.access(file, fs.constants.F_OK, err => {
        console.log(`${file} ${err ? "does not exist" : "exists"}`);
    })
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-type": "text/html"})
        }
        else {
            res.writeHead(200, {"Content-type": dbFile[0].mimetype })
            res.end(content)
        }
    })
})



module.exports= router