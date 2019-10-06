const sgMail = require("@sendgrid/mail");
const sendGridKey = process.env.SG_KEY;

sgMail.setApiKey(sendGridKey);

const sendWelcomeMail = (email, name) => {
  sgMail.send({
    from: "jitendrakumarbhamidipati@gmail.com",
    to: email,
    subject: `Welcome to the APP,${name}`,
    text: `Thank you for joining in.Let me know how you get along with the APP`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    from: "jitendrakumarbhamidipati@gmail.com",
    to: email,
    subject: `Thank you for using the APP,${name}`,
    text: "I hope you had good experience using it."
  });
};

module.exports = {
  sendWelcomeMail,
  sendCancellationEmail
};
