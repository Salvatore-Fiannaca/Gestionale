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
    if (psw.length > 5 & psw == psw2 & username.length > 3) {

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
 
/**
 * -------------- GET ROUTES ----------------
 */
router.get('/', auth, async (req, res) => {
    const numberOfWork = await Work.find({ owner: req.user._id })
    const numberOfArchive = await Client.find({ owner: req.user._id, archive: true })
    const numberOfCompleted = await Work.find({ owner: req.user._id, "work.status": "Concluso" })

    res.render('pages/index', {
        numberOfWork: numberOfWork.length,
        numberOfArchive: numberOfArchive.length,
        numberOfCompleted: numberOfCompleted.length,
        numberInProgress: numberOfWork.length - numberOfCompleted.length
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
    res.render('pages/edit-user', {username: user[0].username})
})

router.get('/forgot', (req, res) => {
    res.render('pages/forgot')
})


module.exports = router;


