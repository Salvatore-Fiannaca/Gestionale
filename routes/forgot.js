const router = require("express").Router();
const transporter = require("../config/send-email");
const connection = require("../config/database");
const { User } = connection.models;
const { tmpPass, genPassword } = require("../utils/passwordUtils")
const express = require("express")

// CSRF PROTECTION
const csrf = require("csurf")
const csrfProtection = csrf({cookie: true})
const parseForm = express.urlencoded(({extended: false}))

router.post("/forgot", parseForm, csrfProtection, async (req, res) => {
  const mail = req.body.mail;
  const user = await User.findOne({ mail: mail });
  console.log(user.forgot)
  
  // IF EXIST SEND MAIL
  if (user.forgot === false) {
    // GENERATE NEW PASS
    let newPass = await tmpPass();
    const hash = await genPassword(newPass);
    await User.findOneAndUpdate(
      { mail: mail },
      { $set: { hash: hash, forgot: true } }
    );
    const mailOptions = {
      from: "Gestionale",
      to: req.body.mail,
      subject: "Recupera Password",
      text: `
      Username: 
      ${user.username} 

      Password temporanea: 
      ${newPass}
      `
    // html: "<h1></h1><p></p>",
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log("Email sent: " + info.response);
    }) 
    res.redirect("/")
  } else if (user.forgot === true)  {
    res.render("pages/forgot", {
      redMsg: true,
      text: "Email di recupero invitata",
      csrfToken: req.csrfToken()
    });
  } else {
    res.render("pages/forgot", {
      redMsg: true,
      text: "Email non valida",
      csrfToken: req.csrfToken()
    });
  }

})

router.get("/forgot", csrfProtection, (req, res) => {
  res.render("pages/forgot", {
    redMsg: false,
    csrfToken: req.csrfToken()
  });
});

module.exports = router;
