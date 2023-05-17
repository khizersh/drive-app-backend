const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");
const username = "biggbeatx@gmail.com";
// const password = "biggbeat@123";
const password = "bfxsgrbkbglwdwlw";

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secureConnection: false,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  auth: {
    user: username,
    pass: password,
  },
});

// user: "artisttesttesting@gmail.com",
// pass: "emuvezdvtcxlpzdt",


const sendEmail = async (email , subject , emailBody) => {

    var mailOptions = {
        from: username,
        to: email,
        subject: subject,
        text: "That was easy!",
        html: emailBody,
      };
      // html: `<p>Forgot password? Click the link to reset <b><a href='https://corona-app-khizersh.vercel.app/token?token=${token}'>Click here</a></b></p>`,

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
}


module.exports = { sendEmail };
