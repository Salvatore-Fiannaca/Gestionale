const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../utils/passwordUtils');
const connection = require('../config/database');
const {User, Work, Client, Count} = connection.models 
const auth = require('../config/auth');
const { ObjectID } = require('mongodb');



/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login-', 
    successRedirect: '/'
}))

router.post('/register', async (req, res) => {

    //  VALIDATION 
    const psw = req.body.password
    const psw2 = req.body.password2
    const username = req.body.username
    if (psw.length > 6 & psw == psw2 & username.length > 3) {

    //  CHECK IF EXIST
        const slot  = await User.find({username: username})

        if (slot.length === 0) {
            const hash =  await genPassword(psw)
            const newUser = await new User({ username: username, hash: hash})
            await newUser.save()

            const count = await new Count({ owner: newUser._id })
            await count.save()

            res.render('pages/login', {
                redMsg: false, 
                greenMsg: true, 
                text: 'Account creato con successo'
            })
        } else {
            res.render("pages/register", {
                redMsg: true, 
                greenMsg: false, 
                text: 'Username non disponibile'
            })
        }
 
    } else {
        res.render("pages/register", {
            redMsg: true, 
            greenMsg: false, 
            text: 'Dati inseriti non validi'
        })
    }
 })

router.post('/edit-user', auth, async (req, res) => {
    const newPass  = req.body.newPass
    const newPass2 = req.body.newPass2

    if (newPass.length > 6 & newPass == newPass2 ) {
        const hash =  await genPassword(newPass)
        await User.findOneAndUpdate({ _id: req.user._id }, { $set: { hash: hash } })
        const user = await User.find({_id : ObjectID(req.user._id) })
        res.render("pages/edit-user", {
            username: user[0].username,
            redMsg: false,
            greenMsg: true, 
            text: 'Password aggiornata con successo'
        })
    } else {
        const user = await User.find({_id : ObjectID(req.user._id) })
        res.render("pages/edit-user", {
            username: user[0].username,
            greenMsg: false,
            redMsg: true, 
            text: 'Riprova con altre credenziali'
        })
    }
})
 
/**
 * -------------- GET ROUTES ----------------
 */
router.get('/', auth, async (req, res) => {
    const numberOfWork = await Work.find({ owner: req.user._id })
    const numberOfArchive = await Client.find({ owner: req.user._id, archive: true })
    const checkNumberOfCompleted = await Work.find({ owner: req.user._id, "work.status": "Concluso" })
    const numberOfCompleted = (checkNumberOfCompleted.length *100) / numberOfWork.length
    const numberInProgress = ((numberOfWork.length - checkNumberOfCompleted.length) * 100) / numberOfWork.length
    
    res.render('pages/index', {
        numberOfWork: numberOfWork.length,
        numberOfArchive: numberOfArchive.length,
        numberInProgress: numberInProgress,
        numberOfCompleted: numberOfCompleted,
    })
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            redMsg: false, 
            greenMsg: false,
        });
    }
});

// LOGIN FAIL
router.get('/login-', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('pages/login', {
            redMsg: true, 
            greenMsg: false,
            text: 'Dati inseriti non validi'
        });
    }
});

router.get('/register', (req, res) => {
    res.render('pages/register', {
        redMsg: false, 
        greenMsg: false
    })
})

router.get('/logout', auth, async(req, res) => {
    req.logout();
    res.redirect('/login');
})

router.get('/edit-user', auth, async(req, res) => {
    const user = await User.find({_id : ObjectID(req.user._id) })
    res.render('pages/edit-user', 
        { username: user[0].username,
          redMsg: false,
          greenMsg: false
        })
})

router.get('/forgot', (req, res) => {
    res.render('pages/forgot')
})



module.exports = router;


