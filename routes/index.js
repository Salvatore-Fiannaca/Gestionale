const router = require("express").Router();
const passport = require("passport");
const { genPassword } = require("../utils/passwordUtils");
const connection = require("../config/database");
const { User, Work, Client, Count, Upload, UploadWork } = connection.models;
const auth = require("../config/auth");
const { ObjectID } = require("mongodb");
const fs = require("fs");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-",
    successRedirect: "/",
  })
);

router.post("/register", async (req, res) => {
  //  VALIDATION
  const psw = req.body.password;
  const psw2 = req.body.password2;
  const username = req.body.username;
  const mail = req.body.mail;

  if (
    (psw.length > 6) &
    (psw == psw2) &
    (username.length > 3) &
    (mail.length > 6)
  ) {
    //  CHECK IF EXIST
    const slotUser = await User.find({ username: username });
    const slotMail = await User.find({ mail: mail });
    if (slotUser.length === 0 & slotMail.length === 0) {
      const hash = await genPassword(psw);
      const newUser = await new User({
        username: username,
        hash: hash,
        mail: mail,
      });
      await newUser.save();
      // INIT COUNT CLIENTS FOR NEW USER
      const count = await new Count({ owner: newUser._id });
      await count.save();

      res.render("pages/login", {
        redMsg: false,
        greenMsg: true,
        text: "Account creato con successo",
      });
    } else {
      res.render("pages/register", {
        redMsg: true,
        greenMsg: false,
        text: "Riprova con altre credenziali",
      });
    }
  } else {
    res.render("pages/register", {
      redMsg: true,
      greenMsg: false,
      text: "Dati inseriti non validi",
    });
  }
});

router.post("/edit-user", auth, async (req, res) => {
  const newPass = req.body.newPass;
  const newPass2 = req.body.newPass2;

  if ((newPass.length > 6) & (newPass == newPass2)) {
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
    });
  } else {
    const user = await User.find({ _id: ObjectID(req.user._id) });
    res.render("pages/edit-user", {
      username: user[0].username,
      greenMsg: false,
      redMsg: true,
      text: "Riprova con altre credenziali",
    });
  }
});

router.post("/delete-me", auth, async (req, res) => {
  const owner = req.session.passport.user;
  try {
    const findWork = await UploadWork.find({ owner: owner })
    const findUpload = await Upload.find({ owner: owner })
    await Client.deleteMany({ owner: owner })
    await Work.deleteMany({ owner: owner })
    // DELETE UPLOAD CLIENT
    await Upload.deleteMany({owner: owner });
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
  await User.findOneAndDelete({ "_id": ObjectID(owner)})
  await Count.findOneAndDelete({ owner: ObjectID(owner)})
  res.redirect("/register")

})

/**
 * -------------- GET ROUTES ----------------
 */
router.get("/", auth, async (req, res) => {
  const user = await User.findOne({ _id: ObjectID(req.user._id) })
  if (user.forgot == true) {
    await User.findOneAndUpdate({ 
      _id: ObjectID(req.user._id)},  
      { $set: { forgot: false }
    })
  }
  const numberOfWork = await Work.find({ owner: req.user._id });
  const numberOfArchive = await Client.find({
    owner: req.user._id,
    archive: true,
  });
  const checkNumberOfCompleted = await Work.find({
    owner: req.user._id,
    "work.status": "Concluso",
  });
  const numberOfCompleted =
    (checkNumberOfCompleted.length * 100) / numberOfWork.length;
  const numberInProgress =
    ((numberOfWork.length - checkNumberOfCompleted.length) * 100) /
    numberOfWork.length;

  res.render("pages/index", {
    numberOfWork: numberOfWork.length,
    numberOfArchive: numberOfArchive.length,
    numberInProgress: numberInProgress,
    numberOfCompleted: numberOfCompleted,
  });
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("pages/login", {
      redMsg: false,
      greenMsg: false,
    });
  }
});

// LOGIN FAIL
router.get("/login-", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render("pages/login", {
      redMsg: true,
      greenMsg: false,
      text: "Dati inseriti non validi",
    });
  }
});

router.get("/register", (req, res) => {
  res.render("pages/register", {
    redMsg: false,
    greenMsg: false,
  });
});

router.get("/logout", auth, async (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/edit-user", auth, async (req, res) => {
  const user = await User.find({ _id: ObjectID(req.user._id) });
  res.render("pages/edit-user", {
    username: user[0].username,
    redMsg: false,
    greenMsg: false,
  });
});


module.exports = router;
