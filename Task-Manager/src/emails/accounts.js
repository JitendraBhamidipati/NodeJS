const sgMail = require("@sendgrid/mail");
const sendGridKey =
  "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";

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
    text: "Thank you for joining in.Let me know how you get along with the APP"
  });
};

module.exports = {
  sendWelcomeMail
};
