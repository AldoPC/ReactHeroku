const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

let mailConfig;

if (process.env.NODE_ENV == "production") {
  const options = {
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  };
  mailConfig = sgTransport(options);
} else {
  if (process.env.NODE_ENV == "staging") {
    console.log("XXXXXXXXXXXXXXXXXXXX");
    const options = {
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    };
    mailConfig = sgTransport(options);
  } else {
    //ethereal (local)
    mailConfig = {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASSWORD,
      },
    };
  }
}

module.exports = nodemailer.createTransport(mailConfig);
