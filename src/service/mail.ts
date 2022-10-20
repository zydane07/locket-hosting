import nodemailer from 'nodemailer';
import { google } from 'googleapis';

export const sendMail = async (
  email: string,
  subject: string,
  text: string,
) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI,
  );
  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  });
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_TRANSPORTER_SERVICE,
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_GMAIL_ACCOUNT,
        clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        accessToken: String(accessToken),
      },
    });
    transporter.sendMail({
      from: process.env.EMAIL_TRANSPORTER_FROM,
      to: email,
      subject,
      html: text,
    });
    console.log('Email send successfully');
  } catch (err) {
    console.log(`something's wrong: ${err}`);
  }
};
