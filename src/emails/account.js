const sgMail = require('@sendgrid/mail');

//const sendgridAPIKey = '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';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//sgMail.setApiKey(sendgridAPIKey);

const welcomeEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: 'jr.otheretc@gmail.com',
    subject: 'Welcome to the TaskApp ' + name,
    text: `Welcome to the app, ${name}. Let me know your thoughts!`
  });
};

const userDeletedAccountEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: 'jr.otheretc@gmail.com',
    subject: 'Sorry to see you go ' + name,
    text: 'Thanks for nothing jerk.'
  });
};

module.exports = {
  welcomeEmail,
  userDeletedAccountEmail
};
