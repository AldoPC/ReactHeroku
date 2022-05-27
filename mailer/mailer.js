const nodemailer = require("nodemailer");

const mailConfig = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PWD,
  },
};

module.exports = nodemailer.createTransport(mailConfig);
