const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const {User, Client, Work, Upload } = connection.models 
const auth = require('../config/auth')
const upload = require('../config/multer')


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
        res.rendirect(`/upload_${code}`)
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

    files.forEach(element => {
        const img = new Upload({
            "fieldname": req.files.fieldname,
            'originalname': req.files.originalname,
            "mimetype": req.files.mimetype,
            "destination": req.files.destination,
            "filename": req.files.filename,
            "path": req.files.path,
            "size": req.files.size
        })
        console.log(img);
    })
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

router.get('/upload_:code', auth, upload, async (req, res) => {
    const client = req.params.code
    res.render('pages/upload-client', {code: client})
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

//--------------------------------------
router.get('/404', (req, res) => {
    res.render('pages/404')
})

router.get('/test', (req, res) => {
    const code = "FNNSTT95R13A087j"
    res.redirect(`/upload_${code}`)
})


module.exports = router;

