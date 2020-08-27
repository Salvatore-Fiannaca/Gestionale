const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../utils/passwordUtils');
const connection = require('../config/database');
const {User, Client, Work} = connection.models 
const auth = require('../config/auth');
const { ObjectID } = require('mongodb');
const { lchown } = require('fs');
const { has } = require('browser-sync');


/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login-', 
    successRedirect: '/'
}))

router.post('/register', async (req, res) => {
    const psw = req.body.password
    const psw2 = req.body.password2
    const username = req.body.username

    if (psw.length > 6 & psw == psw2 & username.length > 3) {
        const hash =  await genPassword(psw)
        const newUser = await new User({ username: username, hash: hash})
        await newUser.save()
        res.render('pages/login', {msg: false, msgOK: true, text: 'Account creato con successo'})
 
    } else {
        res.render("pages/register", {msg: true, msgOK: false, text: 'Dati inseriti non validi'})
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
        res.render('pages/login', {msg: false, msgOK: false,});
    }
});

// LOGIN FAIL
router.get('/login-', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('pages/login', {msg: true, msgOK: false ,text: 'Dati inseriti non corretti'});
    }
});

router.get('/register', (req, res) => {
    res.render('pages/register', {msg: false, msgOK: false, text: ''})
})

router.get('/logout', auth, async(req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/forgot', (req, res) => {
    res.render('pages/forgot')
})


module.exports = router;


