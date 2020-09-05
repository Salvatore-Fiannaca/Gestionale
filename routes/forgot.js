const express = require("express");
const router = new express.Router();
const transporter = require("../config/send-email");
const connection = require("../config/database");
const { User } = connection.models;
const { tmpPass, genPassword } = require("../utils/passwordUtils")

router.post("/forgot", async (req, res) => {
  const mail = req.body.mail;
  const user = await User.findOne({ mail: mail });
  // GENERATE NEW PASS
  
  let newPass = await tmpPass();
  const hash = await genPassword(newPass);
  await User.findOneAndUpdate(
    { mail: mail },
    { $set: { hash: hash } }
  );
  // IF EXIST SEND MAIL
  
  if (user.forgot == false) {
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
  } else if (user.forgot == true)  {
    res.render("pages/forgot", {
      redMsg: true,
      text: "Email di recupero invitata",
    });
  } else {
    res.render("pages/forgot", {
      redMsg: true,
      text: "Email non valida",
    });
  }

})

router.get("/forgot", (req, res) => {
  res.render("pages/forgot", {redMsg: false});
});

module.exports = router;
