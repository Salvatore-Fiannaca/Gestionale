const express = require("express");
const router = new express.Router();
const transporter = require("../config/send-email");
const connection = require("../config/database");
const { User } = connection.models;

router.post("/forgot", async (req, res) => {
  const mail = req.body.mail;
  const user = await User.findOne({ mail: mail });
  // IF EXIST SEND MAIL
  if (user) {
    const newPass = 'newPass'
    const mailOptions = {
      from: "Gestionale",
      to: req.body.mail,
      subject: "Recupera Password",
      text: newPass
    // html: "<h1></h1><p></p>",
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log("Email sent: " + info.response);
    }) 
    res.send("FATTO")
  } else {
    res.send("Email non valida");
  }

});

module.exports = router;
