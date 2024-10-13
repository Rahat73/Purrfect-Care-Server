import config from '../config';
import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.google_acc,
      pass: config.google_app_pass,
    },
  });

  await transporter.sendMail({
    from: config.google_acc, // sender address
    to, // list of receivers
    subject: 'Reset your password within ten mins!', // Subject line
    text: 'If this was not you then please ignore this email. Thank you. - Purrfect Care', // plain text body
    html: `<p>If this was not you then please ignore this email. Thank you. - Purrfect Care</p> </br> ${html}`, // html body
  });
};
