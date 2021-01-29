const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
var session = require('express-session');
const users = require("./routes/api/UserInfo");
const colleges = require("./routes/api/College");
const app = express();
var multer = require('multer');
var cors = require('cors');
const College = require("./models/CollegeSchema");
const User = require("./models/UserInfoSchema");
const Admin = require("./models/AdminSchema");
const loginfo = require("./models/loginfoSchema");
const degree = require("./models/degreeSchema");
const validateUserEditInput = require("./validation/usersave");
const validatePasswordInput = require("./validation/passwordConfirm");
const validateAdminEditInput = require("./validation/adminEdit");
const validateEvaluate = require("./validation/evaluateprofile");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const keys = require("./config/keys");
app.use(cors());
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.set('trust proxy', true);
app.use(bodyParser.json());

const dbURL = "mongodb+srv://test:test@cluster0.o5xpz.mongodb.net/College?authSource=admin&replicaSet=atlas-rq1ugm-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

//connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI || dbURL,
        {useUnifiedTopology: true, useNewUrlParser: true}
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport")(passport);

// Routes
app.use('/public', express.static('public'))
app.use('/public/avatar', express.static('public/avatar'))

app.use("/api/users", users);
app.use("/api/colleges", colleges);

//upload logo image
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({storage: storage}).single('file')
app.post('/upload', function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)

    })

});
//upload avatar
var avartarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var avartarUpload = multer({storage: avartarStorage}).single('file')
app.post('/upload/avatar', function (req, res) {

    avartarUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        let id = req.body.id
        let filename = req.file.originalname

        console.log("avatar request=>", req.body.id, req.file.originalname)
        User.updateOne({_id: id}, {
            $set: {
                avatar: filename
            }
        }, function (err, result) {
            if (err) {
                return res.status(500).json("cannot update avatar")
            }
        })
        return res.status(200).send("OK")

    })

});
//upload admin avatar
app.post('/upload/admin/avatar', function (req, res) {

    avartarUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        let id = req.body.id
        let filename = req.file.originalname

        console.log("avatar request=>", req.body.id, req.file.originalname)
        Admin.updateOne({_id: id}, {
            $set: {
                avatar: filename
            }
        }, function (err, result) {
            if (err) {
                return res.status(500).json("cannot update avatar")
            }
        })
        return res.status(200).send("OK")

    })

});
//edit user
app.post('/updateUser', function (req, res) {
    const {id, nextname, nextemail, nextphonenumber} = req.body
    const {errors, isValid} = validateUserEditInput(req.body)
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(200).json({"error": true, "data": errors});
    }
    console.log("update data=>", id, nextemail, nextname, nextphonenumber)
    try {
        User.updateOne({_id: id}, {
            $set: {
                name: nextname,
                email: nextemail,
                phonenumber: nextphonenumber
            }
        }, function (err, result) {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json({"error": false, "data": "OK"})
            }
        })
    } catch (e) {
        res.status(500).json("net connection error")
    }
})
//edit Admin
app.post('/updateAdmin', function (req, res) {
    const {id, nextname, nextemail, nextusername, nextrole} = req.body
    const {errors, isValid} = validateAdminEditInput(req.body)
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(200).json({"error": true, "data": errors});
    }
    console.log("update data=>", id, nextemail, nextname, nextusername, nextrole)
    try {
        Admin.updateOne({_id: id}, {
            $set: {
                name: nextname,
                email: nextemail,
                username: nextusername,
                role: nextrole
            }
        }, function (err, result) {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json({"error": false, "data": "OK"})
            }
        })
    } catch (e) {
        res.status(500).json("net connection error")
    }
})
//send image to react
app.post('/getLogo', function (req, res) {
    console.log("logo path=>", req.body.logo)
    let path = req.body.logo
    res.status(200).sendFile(path)

});

app.post('/getColleges', function (req, res) {

    College.find({}, function (err, colleges) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(colleges);
            console.log("result==>", colleges)
        }
    })

})
//get Admins
app.post('/getAdmins', function (req, res) {


    Admin.find({}, function (err, Admins) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(Admins);
            console.log("result==>", Admins)
        }
    })

})
//get userloginfos
app.post("/getloginfos", function (req, res) {
    loginfo.find({role: "user"}, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(results);
            console.log("result==>", results)
        }
    })
})
app.post('/deleteCollege', function (req, res) {
    const id = req.body.id
    College.updateOne({_id: id}, {
        $set: {
            status: "Removed"
        }
    }, function (err, result) {
        if (err) {
            return res.status(400).json("remove action failed!")
        } else {
            return res.status(200).json({message: "College deleted"});
        }
    })


})
app.post('/setHoldStatus', function (req, res) {
    const id = req.body.id
    Admin.updateOne({_id: id}, {
        $set: {
            status: "Hold"
        }
    }, function (err, result) {
        if (err) {
            return res.status(400).json("Hold action failed!")
        } else {
            return res.status(200).json({message: "status Hold sets"});
        }

    })
})

app.post('/setRemoveStatus', function (req, res) {
    const id = req.body.id
    Admin.updateOne({_id: id}, {
        $set: {
            status: "Removed"
        }
    }, function (err, result) {
        if (err) {
            return res.status(400).json("Remove action failed!")
        } else {
            return res.status(200).json({message: "status Removed sets"});
        }

    })
})
app.post('/resetAdminPassword', function (req, res) {
    const {id, oldpass, newpass, checkpass} = req.body
    const errors = {}
    if (newpass != checkpass) {
        errors.checkpassword = "confirm password incorrect"
        errors.oldpassword = ""
        return res.status(200).json({"errors": errors})
    }
    console.log("req params=>", id, oldpass, newpass, checkpass)
    let currentUser = {}
    Admin.findOne({_id: id}).then(user => {
        currentUser = user
        bcrypt.compare(oldpass, currentUser.password).then(isMatch => {
            if (isMatch) {
                console.log("successfull oldpass")
                let rounds = 10
                bcrypt.genSalt(rounds, (err, salt) => {
                    bcrypt.hash(newpass, salt, (err, hash) => {
                        console.log("hash==>", hash)
                        if (err) throw err;

                        try {
                            Admin.updateOne({_id: id}, {
                                $set: {
                                    password: hash
                                }
                            }, function (err, result) {
                                if (err) {
                                    return res.status(500).json(err)
                                } else {
                                    return res.status(200).json({"errors": false, "data": "OK"})
                                }

                            })
                        } catch (e) {
                            return res.status(500).json(e)
                        }

                    });
                });
            } else {
                errors.oldpassword = "incorrect oldpassword"
                errors.checkpassword = ""
                errors.username = ""
                errors.name = ""
                errors.email = ""
                return res.status(200).json({"errors": errors})
            }
        })
    });
});
app.post('/getUsers', function (req, res) {

    User.find({}, function (err, Users) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(Users);
            console.log("result==>", Users)
        }
    })

})
//get dashinfo
app.post("/getDashInfo", function (req, res) {
    const today = new Date(Date.now("mm/dd/yyyy")).toLocaleDateString()
    const month = new Date(Date.now()).getMonth()
    console.log("today==>", today, month)
    const dateObj = new Date()

    const response = res
    User.find({}, function (err, res) {
        if (err) {
            return res.status(200).json({error: err})
        } else {
            const data = {
                todayloguser: 0,
                monthloguser: 0,
                totalloguser: 0,
                todayactiveuser: 0,
                monthactiveuser: 0
            }
            for (let index = 0; index < res.length; index++) {

                console.log("database date", res[index].timestamp.toLocaleDateString(), today)
                if (res[index].timestamp.toLocaleDateString() == today) {
                    console.log("database date", res[index].timestamp.toLocaleDateString(), today)
                    data.todayloguser++;
                    if (res[index].status == "Active") {
                        data.todayactiveuser++
                    }

                }
                console.log("database date", res[index].timestamp.getMonth(), month)
                if (res[index].timestamp.getMonth() == month) {
                    data.monthloguser++;
                    console.log("database date", res[index].timestamp.getMonth(), month)
                    if (res[index].status == "Active") {
                        data.monthactiveuser++
                    }

                }

            }
            data.totalloguser = res.length

            console.log("dashinfo==>", data.todayloguser, data.monthloguser, data.totalloguser, data.todayactiveuser, data.monthactiveuser)
            //return response.status(200).json({"todaylogUser":data.todayloguser,"monthlogUser":data.monthloguser,"totallogUser":data.totalloguser,"todayactiveUser":data.todayactiveuser,"monthactiveUser":data.monthactiveuser})
            return response.status(200).json({"data": data})
        }

    })


})

app.post('/lockCollege', function (req, res) {
    const colName = req.body.name;
    console.log("req data=>", colName);
    College.updateOne({
        name: colName
    }, {
        $set: {
            status: false
        }
    }, function (err, results) {
        if (err)
            return res.status(400).json(err)
        else
            res.status(200).json({status: "ok"})
    });
})

app.post('/unlockCollege', function (req, res) {
    const colName = req.body.name;
    console.log("req data=>", colName);
    College.updateOne({
        name: colName
    }, {
        $set: {
            status: true
        }
    }, function (err, results) {
        if (err)
            return res.status(400).json(err)
        else
            res.status(200).json({status: "ok"})
    });
})
//change password
app.post("/changePassword", function (req, res) {
    const {id, password, passconfirm} = req.body
    const {errors, isValid} = validatePasswordInput(req.body)

    console.log("error ocuured==>", errors)
    if (!isValid) {
        return res.status(200).json({"error": true, "data": errors})
    }
    // Hash password before storing in database
    const rounds = 10;
    let hashpassword = ''
    bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            console.log("hash==>", hash)
            if (err) throw err;
            hashpassword = hash;
            try {
                User.updateOne({_id: id}, {
                    $set: {
                        password: hashpassword
                    }
                }, function (err, result) {
                    if (err) {
                        return res.status(500).json(err)
                    } else {
                        return res.status(200).json({"error": false, "data": "OK"})
                    }

                })
            } catch (e) {
                return res.status(500).json(e)
            }

        });
    });


})

//lock or unlock user status
app.post('/setUnlock', function (req, res) {
    const id = req.body._id
    console.log("user id==>", id)
    try {
        User.updateOne({_id: id}, {
            $set: {
                status: "Active"
            }
        }, function (err, result) {
            if (err) {
                return res.status(500).json(err)
            }
        })
    } catch (e) {
        return res.status(500).json(e)
    }
    return res.status(200).json("OK")
})

app.post('/setlock', function (req, res) {
    const id = req.body._id
    console.log("user id==>", id)
    try {
        User.updateOne({_id: id}, {
            $set: {
                status: "Hold"
            }
        }, function (err, result) {
            if (err) {
                return res.status(500).json(err)
            }
        })
    } catch (e) {
        return res.status(500).json(e)
    }
    return res.status(200).json("OK")
})
//adddegree
app.post("/addDegree", function (req, res) {
    const {type, text} = req.body
    console.log("data=>", type, text)
    const newDegree = new degree({
        type: type,
        text: text
    })
    newDegree.save()
        .then(degree => res.status(200).json(degree))
        .catch(err => res.status(200).json({"error": err}));

})
app.post("/getDegrees", function (req, res) {

    degree.find({type: "Degree"}, function (err, degrees) {
        if (err) {
            res.status(200).json({"errors": err})
        } else {
            console.log("degrees=>", degrees)
            res.status(200).json({"errors": false, "degrees": degrees})
        }
    })


})
app.post("/getSpecialiaztions", function (req, res) {
    degree.find({type: "Specialization"}, function (err, specializations) {
        if (err) {
            res.status(200).json({"errors": err})
        } else {
            console.log("specializations=>", specializations)
            res.status(200).json({"errors": false, "specializations": specializations})
        }
    })


})
//user side
app.post("/getPlaceholder", (req, res) => {

    College.find({}, function (err, result) {
        if (err) {
            return res.status(200).json({"error": err})
        } else {
            if (!result[0]) {
                return res.status(200).json({error: err})
            } else {
                console.log("checking results==>", result)
                let names = []
                for (let index = 0; index < result.length; index++) {
                    names.push(result[index].name)
                }
                console.log("names===>", names)
                return res.status(200).json({error: false, data: names})
            }

        }
    })
});
app.post("/userSearchCollege", (req, res) => {
    let name = ""
    name = req.body.name
    console.log("request==>", name)
    College.findOne({name: name.trim()}).then(college => {
        console.log("search result==>", college)
        if (!college) {
            return res.status(200).json({error: true})
        } else {
            return res.status(200).json({error: false, data: college})
        }
    })
})
app.post("/userGetPlaceInfos", (req, res) => {
    College.find({}, function (err, data) {
        if (err) {
            return res.status(400).json({error: err})
        } else {
            return res.status(200).json({error: false, data: data})
        }
    })
});


//EvaluateProfile
app.post("/userEvaluateColleges", (req, res) => {
    console.log("req data==>", req.body);
    let {country, state, GRE, toefl} = req.body;
    const data = {
        country,
        state,
        GRE,
        Toefl: toefl
    };
    const {errors, isValid} = validateEvaluate(data);
    console.log("errors occured:", errors);
    if (!isValid) {
        return res.status(200).json({"error": true, "data": errors});
    }
    let GREfrom = Number(GRE) - 5;
    let GREto = Number(GRE) + 5;
    let toeflNum = Number(toefl);
    console.log("GRE range=>", GREfrom, GREto)
//, {'GRE':{$gte: GRE-5, $lte: GRE+5 }}
    if (toefl === '') {
        console.log("toefl==>111", toefl)
        College.find({
            $or: [{'address.country': country}, {'address.state': state}, {
                'GRE': {
                    $gte: GREfrom,
                    $lte: GREto
                }
            }]
        }, function (err, data) {
            if (err) {
                return res.status(400).json({"error": err});
            } else {
                //console.log("Evaluate data==>",data)
                return res.status(200).json({"error": false, "data": data})
            }
        })
    } else {
        if (toefl > 10) {
            console.log("toefl==>222", toefl)
            College.find({
                $or: [{'address.country': country}, {'address.state': state}, {
                    'GRE': {
                        $gte: GREfrom,
                        $lte: GREto
                    }, 'Toefl': {$gte: toeflNum - 5, $lte: toeflNum + 5}
                }]
            }, function (err, data) {
                if (err) {
                    return res.status(400).json({"error": err});
                } else {
                    //console.log("Evaluate data==>",data)
                    return res.status(200).json({"error": false, "data": data})
                }
            })
        } else {
            console.log("toefl==>333", toefl)
            College.find({
                $or: [{'address.country': country}, {'address.state': state}, {
                    'GRE': {
                        $gte: GREfrom,
                        $lte: GREto
                    }, 'IELTS': {$gte: toeflNum - 0.5, $lte: toeflNum + 0.5}
                }]
            }, function (err, data) {
                if (err) {
                    return res.status(400).json({"error": err});
                } else {
                    // console.log("Evaluate data==>",data)
                    return res.status(200).json({"error": false, "data": data})
                }
            })
        }
    }

});

app.post("/userShortlist", (req, res) => {
    console.log("req data==>", req.body);
    const userId = req.body.user.id;
    const collegeName = req.body.college.name;
    console.log("id", userId);
    User.updateOne({_id: userId}, {
        $set: {
            shortlist: collegeName
        }
    }, {multi: true}, function (err, result) {
        if (err) {
            return res.status(400).json(err);
        }
    })
    return res.status(200).json("successfully updated!");
});

app.post("/getDegreeSuggestons", (req, res) => {
    degree.find({}, function (err, result) {
        if (err) {
            return res.status(400).json(err);
        } else {
            let data = [];
            for (let index = 0; index < result.length; index++) {
                data.push(result[index].text);
            }
            return res.status(200).json(data);
        }

    })
});

app.post("/userDegreeColleges", (req, res) => {
    console.log("req data==>", req.body);
    const {country, state, degree, course} = req.body;
    if (country === '' && state === '' && degree === '' && course === '') {
        College.find({}, function (err, result) {
            if (err) {
                return res.status(400).json(err);
            } else {
                return res.status(200).json(result);
            }
        });
    } else {
        College.find({'address.country': country, 'address.state': state, 'degree': degree}, function (err, result) {
            if (err) {
                return res.status(400).json(err);
            } else {
                return res.status(200).json(result);
            }
        });
    }
});

app.post("/updatePasswordByEmail", (req, res) => {
    console.log("EmailPassword==>", req.body);
    const {email, password, confirmpassword} = req.body;
    console.log("jwt==>", jwt.verify(email, keys.secretOrKey));
    const decoded = jwt.verify(email, keys.secretOrKey).email;
    if (!decoded) {
        return res.status(400).json({"timeerror": "email is not expired in a time"});
    }
    console.log("decoded==>", decoded);
    if (email != "") {
        let rounds = 10;
        bcrypt.genSalt(rounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                console.log("hash==>", hash)
                if (err) throw err;

                try {
                    User.updateOne({email: decoded}, {
                        $set: {
                            password: hash
                        }
                    }, function (err, result) {
                        if (err) {
                            return res.status(500).json(err)
                        } else {
                            return res.status(200).json({"errors": false, "data": "OK"})
                        }

                    })
                } catch (e) {
                    return res.status(500).json(e)
                }

            });
        });
    } else {
        return res.status(400).json("email can not be null");
    }
});

//resetUserPassword
app.post("/resetUserPassword",(req,res)=>{
    const {id, oldpass, newpass, checkpass} = req.body
    const errors = {}
    if (newpass != checkpass) {
        errors.checkpassword = "confirm password incorrect"
        errors.oldpassword = ""
        return res.status(200).json({"errors": errors})
    }
    console.log("req params=>", id, oldpass, newpass, checkpass)
    let currentUser = {}
    User.findOne({_id: id}).then(user => {
        currentUser = user;
        bcrypt.compare(oldpass, currentUser.password).then(isMatch => {
            if (isMatch) {
                console.log("successfull oldpass")
                let rounds = 10
                bcrypt.genSalt(rounds, (err, salt) => {
                    bcrypt.hash(newpass, salt, (err, hash) => {
                        console.log("hash==>", hash)
                        if (err) throw err;

                        try {
                            User.updateOne({_id: id}, {
                                $set: {
                                    password: hash
                                }
                            }, function (err, result) {
                                if (err) {
                                    return res.status(500).json(err)
                                } else {
                                    return res.status(200).json({"errors": false, "data": "OK"})
                                }

                            })
                        } catch (e) {
                            return res.status(500).json(e)
                        }

                    });
                });
            } else {
                errors.oldpassword = "incorrect oldpassword"
                errors.checkpassword = ""
                return res.status(200).json({"errors": errors})
            }
        })
    });
});
app.post("/activeUserByEmail",(req,res)=>{
    console.log("EmailPassword==>", req.body);
    const {email} = req.body;
    console.log("jwt==>", jwt.verify(email, keys.secretOrKey));
    const decoded = jwt.verify(email, keys.secretOrKey).email;
    if (!decoded) {
        return res.status(400).json({"timeerror": "email is not expired in a time"});
    }
    console.log("decoded==>", decoded);
    if (email != "") {
                try {
                    User.updateOne({email: decoded}, {
                        $set: {
                            status: "Active"
                        }
                    }, function (err, result) {
                        if (err) {
                            return res.status(500).json(err)
                        } else {
                            return res.status(200).json({"errors": false, "data": "OK"})
                        }

                    })
                } catch (e) {
                    return res.status(500).json(e)
                }

    } else {
        return res.status(400).json("email can not be null");
    }
});
if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, "client", "build")))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));

