const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PSW,
  },
})

module.exports = transporter
