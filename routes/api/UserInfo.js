const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
import axios from "axios";
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateEmailInput = require("../../validation/sendemail");

const config = require('../../config/app');
const nodemailer = require('nodemailer');
const winston = require('winston');
const fs = require('fs');
const hbs = require('nodemailer-express-handlebars');

// Load User model
const UserInfo = require("../../models/UserInfoSchema");
const AdminInfo = require("../../models/AdminSchema");
const loginfo = require("../../models/loginfoSchema");
var requestIp = require('request-ip');
const RequestIp = require('@supercharge/request-ip');

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/sendMail", (req, res) => {
    console.log("email reset:", req.body);
    const {errors, isValid} = validateEmailInput(req.body);
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    let {email} = req.body;
    UserInfo.findOne({email: email}).then(user => {
        if (user) {
            let mailtoken="";
            jwt.sign(
                {email:email},
                keys.secretOrKey,
                {
                    expiresIn: '2h'
                },
                (err, token) => {
                   mailtoken=token;
                   console.log("token==>",mailtoken);
                }
            );
           
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
                to: email,
                subject: 'Sending Email for Updating Password',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + '192.46.215.57' + '/updatepassword/' + mailtoken + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, (err, info) => {
                // console.log('mailData', mailData)
                if (err) {
                    console.log('err', err);
                    reject(err)
                } else {
                    resolve(true);
                }
            });
            return res.status(200).json({errors:false});
        }else{
            return res.status(200).json({errors:"email is not registered!"});
        }
    });


});

router.post("/register", (req, res) => {
    console.log("register request:", req.body);
    //Form validation
    const {errors, isValid} = validateRegisterInput(req.body);
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    UserInfo.findOne({email: req.body.email}).then(user => {

        if (user) {
            return res.status(400).json({email: "Email already exists"});
        } else {
            const newUser = new UserInfo({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                status: "Hold",
                avatar: "test.png",
                shortlist:""
            });

            // Hash password before storing in database
            const rounds = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    let mailtoken="";
                    newUser
                        .save()
                        .then(user => {
                            jwt.sign(
                                {email:user.email},
                                keys.secretOrKey,
                                {
                                    expiresIn: '2h'
                                },
                                (err, token) => {
                                    mailtoken=token;
                                    console.log("token==>",mailtoken);
                                }
                            );
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
                                to: email,
                                subject: 'Sending Email for Updating Password',
                                text: 'You are receiving this because you (or someone else) have requested the sign up  for your account.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    'http://' + '192.46.215.57' + '/ActiveUser/' + mailtoken + '\n\n' +
                                    'If you did not request this, please ignore this email and you will remain inactive status.\n'
                            };
                            transporter.sendMail(mailOptions, (err, info) => {
                                // console.log('mailData', mailData)
                                if (err) {
                                    console.log('err', err);
                                    reject(err)
                                } else {
                                    resolve(true);
                                }
                            });
                            return res.status(200).json({user});
                        })
                        .catch(err => console.log(err));
                });
            });
        }

    });

});

router.get("/ActiveUser/:id",(req,res)=>{
    const token=req.params.id;
    console.log("token==>",token);
});
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", (req, res) => {

    //Form Valdiation
    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    console.log("log info:", req.body);
    const name = req.body.username;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;
    //Find user by Email
    const ip = RequestIp.getClientIp(req)
    console.log("real ip=>", ip)
    if (isAdmin === false) {
        UserInfo.findOne({name}).then(user => {
            if (!user) {
                return res.status(404).json({usernotfound: "User not found"});
            }else{
                if(user.status==="Active"){
                    // Check password
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            loginfo.insertMany({name: user.name, ipaddress: ip, role: "user"})
                            // Create JWT Payload
                            const payload = {
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                role: user.role,
                                status: user.status,
                                avatar: user.avatar,
                                email: user.email
                            };

                            // Sign token
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {
                                    expiresIn: '2h'
                                },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                }
                            );
                        } else {
                            return res
                                .status(400)
                                .json({passwordincorrect: "Password incorrect"});
                        }
                    });
                }else{
                    return res.status(400).json({passwordincorrect:"you are pending status, please check email"});
                }
            }


        });
    } else
        AdminInfo.findOne({name}).then(user => {
            if (!user) {
                return res.status(404).json({usernotfound: "User not found"});
            }
            console.log("admins===>", password, user.password);
            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    loginfo.insertMany({name: user.name, ipaddress: ip, role: user.role})
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                        status: user.status,
                        avatar: user.avatar,
                        email: user.email
                    };
                    console.log("user info=>", payload)
                    // Sign token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res
                        .status(400)
                        .json({passwordincorrect: "Password incorrect"});
                }
            });
        });


});

module.exports = router;