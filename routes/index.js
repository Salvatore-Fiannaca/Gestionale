const router = require('express').Router();
const passport = require('passport');
const { genPassword } = require('../utils/passwordUtils');
const connection = require('../config/database');
const {User} = connection.models 
const auth = require('../config/auth')


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
     .then((user) => {})
   res.redirect('/')
 })
 
/**
 * -------------- GET ROUTES ----------------
 */
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('pages/index');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
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


module.exports = router;


