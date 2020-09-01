const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "testmailgestionale",
    pass: process.env.PSW,
  },
})


// EXAMPLE 
/*

const mailOptions = {
  from: "",
  to: "",
  subject: "",
  text: "",
  html: "<h1></h1><p></p>",
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) console.log(err);
  else console.log("Email sent: " + info.response);
})

*/

module.exports = transporter
