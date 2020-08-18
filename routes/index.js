const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../lib/passwordUtils');
const connection = require('../config/database');
const User = connection.models.User;
const Client = connection.models.Client;
const Work = connection.models.Work;
const auth = require('../config/auth')
const multer = require('multer');
const { MulterError } = require('multer');
const Upload = connection.models.Upload;


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
         console.log("Account amministratore creato con successo")
     })
   res.redirect('/')
 })

router.post('/client', auth, async (req, res) => {
    const newClient = await new Client({
        "profile.firstName": req.body.firstName,
        "profile.lastName": req.body.lastName,
        "profile.fiscalCode": req.body.fiscalCode,
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
        res.redirect('/clients')
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


  // TEST MULTER
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'upload/img')
    },
    filename: function(req, file, callback) {
        const parts = file.mimetype.split("/");
        callback(null, `${file.filename}-${Date.now()}.${parts[1]}`)
    }
})

const upload = multer({storage}) 


router.post('/test', auth, upload.single('image'), async (req, res) => {
    
    //console.log(req.file);
    //console.log(__dirname);
    //test = (path.join(__dirname + '../' + req.file.path))
    //console.log(test);
    //res.sendFile(path.join(__dirname + '../' +"/" + req.file.filename))
})

router.get('/test', auth, async (req, res) => {
    res.render('test')
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
    res.render('pages/show-clients', {clientList: filter});
})
//--------UNDER CONSTRUCTION------------
router.get('/practice', auth, (req, res) => {
    res.render('pages/practice')
})
router.get('/_:code', auth, async (req, res) => {
    code = req.params.code 
    try {
        const clientList = await Work.find({"client": code})
        console.log(clientList[0])
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


module.exports = router;

