const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const {User, Client, Work, Upload } = connection.models 
const auth = require('../config/auth')
const upload = require('../config/multer')
const fs = require('fs');
const { ObjectID } = require('mongodb');


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
         console.log("Account creato con successo")
     })
   res.redirect('/')
 })

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

router.post('/upload_:code', auth, upload, async (req, res) => {
    const client = req.params.code
    // CHECK FILE
    const files = req.files

    const removeEmpySpace = (str) => {
        // pulisci
        let firstPass = str.replace(' ', '')
        let secondPass = firstPass.replace(' ', '')
        let thirdPass = secondPass.replace(' ', '')
        let fourthPass = thirdPass.replace(' ', '')
        // ritorna stringa pulita
        return fourthPass
    }

    files.forEach(file => {
        const path = removeEmpySpace(file.path)
        console.log(path);
        const newFile = new Upload({
            "client": client,
            "fieldname": file.fieldname,
            'originalname': file.originalname,
            "mimetype": file.mimetype,
            "destination": file.destination,
            "filename": file.filename,
            "path": path,
            "size": file.size
        })

        try {
            newFile.save()
            console.log(file.originalname + " Caricato con successo")
        } catch (e) {
            console.log(e);
        }
    })

    res.redirect('/clients')
 /*    
    if (img) {
        console.log(img);
        console.log("File Ready to upload");
        // CERCA CLIENTE BY CODICE FISCALE
        /* try {
            const client = await Client.find({"client": client})
            //console.log(clientList[0])
            res.render('pages/showForCode', {clientList: clientList});
        } catch (e) {
            console.log(e)
            res.send('User not found')
        }
        // INSERT FILE 
        try {
            img.save()
            res.send("Done")
        } catch (e) {
            console.log(e);
        }
    } else {
        // REDIRECT 
    }   
    */
       
})




/**
 * -------------- GET ROUTES ----------------
 */
//  LOGIN / DASHBOARD
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

router.get('/clients', auth, async (req, res) => {
    owner = req.session.passport.user
    const filter = await Client.find({owner: owner})
    res.render('pages/show-clients', {clientList: filter, n: 1});
})

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

router.get('/upload_:code', auth, upload, async (req, res) => {
    const client = req.params.code
    res.render('pages/upload-client', {code: client})
})


router.get('/show-upload_:code', auth, async (req, res) => {
    try {
        const clientList = await Upload.find({client: req.params.code })
        res.render('pages/showUpload', {clientList: clientList});
    } catch (e) {
        console.log(e)
        res.send('User not found')
    }
})



//--------------------------------------
router.get('/404', (req, res) => {
    res.render('pages/404')
})

router.get('/file_:id', async(req, res) => {

    const dbFile = await Upload.find({_id: ObjectID(req.params.id)})
    const path = "/home/jil/Desktop/Gestionale/" // CARTELLA PROGETTO
    const file = path + dbFile[0].path
    console.log(file);
    fs.access(file, fs.constants.F_OK, err => {
        console.log(`${file} ${err ? "does not exist" : "exists"}`);
    })
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-type": "text/html"})
        }
        else {
            res.writeHead(200, {"Content-type": "application/pdf"})
            res.end(content)
        }
    })



})


module.exports = router;

