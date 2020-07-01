const sgMail = require("@sendgrid/mail");

const env = require("dotenv");
env.config();
const apikey =process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apikey);
const html=require('./html')
const sendWelcomeEmail = (user, link) => {
  const template=html(user,link)
  sgMail.send({
    
    to: user.email,
    from: "code.asg@protonmail.com",
    subject: "Codestock Signup",
    text: "Welcome to Codestock",
    html: template,
  });
};







module.exports = {
  sendWelcomeEmail,
};
