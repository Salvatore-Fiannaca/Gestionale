const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../utils/passwordUtils');
const connection = require('../config/database');
const {User, Client} = connection.models 
const auth = require('../config/auth');


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
    const numberOfClients = await Client.find({owner: req.user._id})
    res.render('pages/index', {numberOfClients: numberOfClients.length})
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
});

router.get('/forgot', (req, res) => {
    res.render('pages/forgot')
})


module.exports = router;


