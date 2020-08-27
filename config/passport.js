const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const { validPassword } = require('../utils/passwordUtils');
const User = connection.models.User;

const customFields = {
    usernameField: 'username',
    passwordField: 'password',
}


const verifyCallback = async (username, password, done) => {
  //check if exist user
  const user = await User.findOne({ username: username})
    if (!user) {
      return done(null, false)
    }
    // check if valid pw
    const isValid = await validPassword(password, user.hash)
    if (isValid) {
      return done(null, user)
    } else {
      return done(null, false)
    }
}

const strategy = new LocalStrategy(customFields, verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user)
    })
    .catch(e => done(e))
})
