const express = require("express");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateCollegeInput = require("../../validation/college");
const College = require("../../models/CollegeSchema");
router.post("/Addcollege", (req, res) => {
    console.log("addcollege request:", req.body);
    //Form validation
    const logo = req.body.logo;
    console.log("logo path===>", logo);
    const {errors, isValid} = validateCollegeInput(req.body);
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const {
        name, description, tuitionFee, accomodationFee, applicationFee, springDeadline, summerDeadline, fallDeadline, WES, overallRating, livingCostRating, jobsRating,
        universityType, webSite, establishmentType, phoneNumber, email, acceptanceRate, graduationRate, GRE, IELTS, Toefl, degrees, specializations
    } = req.body;
    let Degrees = [];
    let Specials = [];
    for (let index = 0; index < degrees.length; index++) {
        let item = degrees[index].label;
        Degrees.push(item);
    }
    console.log("Degrees==>", Degrees);
    for (let index = 0; index < specializations.length; index++) {
        let item = specializations[index].label;
        Specials.push(item);
    }
    console.log("Degrees==>", Specials);
    const address = {
        streetNo: req.body.streetNo,
        city: req.body.city,
        country: req.body.country,
        state: req.body.state,
        zipcode: req.body.zipcode
    };
    console.log("success==============>");


    console.log("name===>", name);
    College.findOne({name: name}).then(college => {
        if (college) {
            College.updateOne({name: name}, {
                $set: {
                    name: name,
                    logo: logo,
                    description: description,
                    tuitionFee: tuitionFee,
                    accomodationFee: accomodationFee,
                    applicationFee: applicationFee,
                    springDeadline: springDeadline,
                    summerDeadline: summerDeadline,
                    fallDeadline: fallDeadline,
                    WES: WES,
                    overallRating: overallRating,
                    livingCostRating: livingCostRating,
                    jobsRating: jobsRating,
                    universityType: universityType,
                    webSite: webSite,
                    establishmentType: establishmentType,
                    phoneNumber: phoneNumber,
                    email: email,
                    acceptanceRate: acceptanceRate,
                    graduationRate: graduationRate,
                    GRE: GRE,
                    IELTS: IELTS,
                    Toefl: Toefl,
                    address: address,
                    status: true,
                    degrees: Degrees,
                    specializations: Specials
                }
            }, (err, result) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    res.status(200).json({status: "ok"})
                }
            })
        } else {
            College.insertMany({
                name: name,
                logo: logo,
                description: description,
                tuitionFee: tuitionFee,
                accomodationFee: accomodationFee,
                applicationFee: applicationFee,
                springDeadline: springDeadline,
                summerDeadline: summerDeadline,
                fallDeadline: fallDeadline,
                WES: WES,
                overallRating: overallRating,
                livingCostRating: livingCostRating,
                jobsRating: jobsRating,
                universityType: universityType,
                webSite: webSite,
                establishmentType: establishmentType,
                phoneNumber: phoneNumber,
                email: email,
                acceptanceRate: acceptanceRate,
                graduationRate: graduationRate,
                GRE: GRE,
                IELTS: IELTS,
                Toefl: Toefl,
                address: address,
                status: true,
                degrees: Degrees,
                specializations: Specials
            });
            res.status(200).json({status: "ok"})
        }
    });


});

router.post("/getCollegeInfo", (req, res) => {
    console.log("req=>", req.body.name);
    let name = req.body.name;
    College.findOne({name: name}, function (err, college) {
        if (err) {
            console.log(err);
            res.status(400).json(err)
        } else {
            res.status(200).json(college);
            console.log("result==>", college)

        }
    })


});

module.exports = router;