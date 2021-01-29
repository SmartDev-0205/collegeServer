const jwt = require('jsonwebtoken')
const path = require('path');
const bcrypt = require('bcryptjs');
const winston = require('winston');
const randomstring = require('randomstring');
//const User = require('../../models/User');
const Fridges = require('../../models/Fridges');
const FridgeType = require('../../models/FridgeType');
const config = require('../../config/app');
const {sendEmailWithFile} = require('../../service/mailService');

sendReportByEmail = async (req, res) => {
    let {email} = req.body;
    let transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: config.mailPort,
        secure: false,
        tls: {
            rejectUnauthorized: false
        },
        auth:
            {
                user: config.mailUsername,
                pass: config.mailPassword
            }
    });
    var mailOptions = {
        from: config.mailHost,
        to:email,
        subject: 'Sending Email for Updating Password',
        text: 'That was easy!'
    };
    transporter.sendMail(mailOptions, (err, info) => {
        // console.log('mailData', mailData)
        if (err) {
            console.log('err', err)
            reject(err)
        } else {
            resolve(true);
        }
    });

}

module.exports = {
    sendReportByEmail,
}
