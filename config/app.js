require('dotenv').config();

let env = process.env.NODE_ENV || 'development';
let config= {
    //Email Service
    mailHost: process.env.MAIL_HOST || "no-reply@crioon.com",
    mailPort: parseInt(process.env.MAIL_PORT) || 587,
    mailUsername: process.env.MAIL_USERNAME || "no-reply@crioon.com",
    mailPassword: process.env.MAIL_PASSWORD || "test123test",
};
module.exports = config;
