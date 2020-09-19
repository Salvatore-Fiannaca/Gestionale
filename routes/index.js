const router = require("express").Router();
const passport = require("passport");
const { genPassword } = require("../utils/passwordUtils");
const connection = require("../config/database");
const { User, Work, Client, Count, Upload, UploadWork } = connection.models;
const auth = require("../config/auth");
const { ObjectID } = require("mongodb");
const fs = require("fs");
const { UserPatt, PswPatt, MailPatt } = require('../utils/isValidate')
const express= require("express")

// CSRF PROTECTION
const csrf = require("csurf")
const csrfProtection = csrf({cookie: true})
const parseForm = express.urlencoded(({extended: false}))

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  parseForm,
  csrfProtection,
  passport.authenticate("local", {
    failureRedirect: "/login-",
    successRedirect: "/",
  })
);

router.post("/register", parseForm, csrfProtection, async (req, res) => {
  const psw = req.body.password;
  const psw2 = req.body.password2;
  const username = req.body.username;
  const mail = req.body.mail;

  //  VALIDATION
  if (
    (psw == psw2) &
    UserPatt(username) &
    PswPatt(psw) &
    MailPatt(mail)
  ) {
    //  CHECK IF EXIST
    const slot = await User.exists({ $or: [{ username }, { mail }] })
    if (!slot) {
      const hash = await genPassword(psw);
      const newUser = await new User({ username, hash, mail });
      await newUser.save();
      // INIT COUNT CLIENTS FOR NEW USER
      const count = await new Count({ owner: newUser._id });
      await count.save();

      res.render("pages/login", {
        redMsg: false,
        greenMsg: true,
        text: "Account creato con successo",
        csrfToken: req.csrfToken()
      });
    } else {
      res.render("pages/register", {
        redMsg: true,
        greenMsg: false,
        text: "Riprova con altre credenziali",
        csrfToken: req.csrfToken()
      });
    }
  } else {
    res.render("pages/register", {
      redMsg: true,
      greenMsg: false,
      text: "Dati inseriti non validi",
      csrfToken: req.csrfToken()
    });
  }
});

router.post("/edit-user", auth, parseForm, csrfProtection, async (req, res) => {
  const newPass = req.body.newPass;
  const newPass2 = req.body.newPass2;

  if ((PswPatt(newPass)) & (newPass == newPass2)) {
    const hash = await genPassword(newPass);
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { hash: hash } }
    );
    const user = await User.find({ _id: ObjectID(req.user._id) });
    res.render("pages/edit-user", {
      username: user[0].username,
      redMsg: false,
      greenMsg: true,
      text: "Password aggiornata con successo",
      csrfToken: req.csrfToken()
    });
  } else {
    const user = await User.find({ _id: ObjectID(req.user._id) });
    res.render("pages/edit-user", {
      username: user[0].username,
      greenMsg: false,
      redMsg: true,
      text: "Riprova con altre credenziali",
      csrfToken: req.csrfToken()
    });
  }
});

router.post("/delete-me", auth, parseForm, csrfProtection, async (req, res) => {
  const owner = req.session.passport.user;
  try {
    const findWork = await UploadWork.find({ owner: owner })
    const findUpload = await Upload.find({ owner: owner })
    await Client.deleteMany({ owner: owner })
    await Work.deleteMany({ owner: owner })
    // DELETE UPLOAD CLIENT
    await Upload.deleteMany({ owner: owner });
    findUpload.forEach((file) => {
      let path = file.path;
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    // DELETE UPLOAD WORK CLIENT
    await UploadWork.deleteMany({ owner: owner });
    findWork.forEach((file) => {
      let path = file.path;
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  } catch (err) {
    console.log(err)
  }
  await User.findOneAndDelete({ "_id": ObjectID(owner) })
  await Count.findOneAndDelete({ owner: ObjectID(owner) })
  res.redirect("/register")

})

/**
 * -------------- GET ROUTES ----------------
 */
router.get("/", auth, async (req, res) => {
  // CHECK IF FORGOT 
  const user = await User.findOne({ _id: ObjectID( req.user._id ) }).lean()
  if ( user.forgot === true ) {
    await User.findOneAndUpdate({
      _id: ObjectID(req.user._id)
    },
      {
        $set: { forgot: false }
      })
  }

  //  STATISTICS
  const numberOfWork = await Work.estimatedDocumentCount({ owner: req.user._id })
  const numberOfArchive = await Client.countDocuments({ owner: req.user._id, archive: true })
  const checkNumberOfCompleted = await Work.countDocuments({ owner: req.user._id, "work.status": "Concluso" })
  var numberOfCompleted =
    (checkNumberOfCompleted * 100) / numberOfWork;

  var numberInProgress =
    ((numberOfWork - checkNumberOfCompleted) * 100) /
    numberOfWork;

  if ( isNaN( numberInProgress ) === true) {numberInProgress = 0}
  if ( isNaN( numberOfCompleted ) === true) {numberOfCompleted = 0}


  res.render("pages/index", {
    numberOfWork,
    numberOfArchive,
    numberInProgress,
    numberOfCompleted,
    links: user.links
  });
});

router.get("/login", csrfProtection, async (req, res) => {
  if ( req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("pages/login", {
      redMsg: false,
      greenMsg: false,
      csrfToken: req.csrfToken()
    });
  }
});
// duplicate login for passport redirect
router.get("/login-", csrfProtection, (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("pages/login", {
      redMsg: true,
      text: "Utente o password non validi",
      greenMsg: false,
      csrfToken: req.csrfToken()
    });
  }
});

router.get("/register", csrfProtection, (req, res) => {
  res.render("pages/register", {
    redMsg: false,
    greenMsg: false,
    csrfToken: req.csrfToken()
  });
});

router.get("/logout", auth, (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/edit-user", auth, csrfProtection, async (req, res) => {
  const user = await User.find({ _id: ObjectID(req.user._id) }).lean();
  res.render("pages/edit-user", {
    username: user[0].username,
    redMsg: false,
    greenMsg: false,
    csrfToken: req.csrfToken()
  });
});

router.get("/support", auth, (req, res) => res.render("pages/support"));
router.get("/404", (req, res) => res.render("pages/404"))


module.exports = router;

