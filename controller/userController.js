const db = require('../models');
const bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
const randomstring = require('randomstring');

var transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "rututhakkar105@gmail.com",
        pass: "rutu@510"
    }
});

// var transport = nodemailer.createTransport({
//     service: 'Mailgun',
//     auth: {
//         user: process.env.MailgunUser,
//         pass: process.env.MailgunPass
//     }, tls: {
//         rejectUnauthorized: false
//     }
// })

var rand, mailOptions, host, link, passwordhash;

exports.home = (req, res) => {
    res.send("Hey USER!, Welcome, Have A Great Day!")
}

exports.signup = (req, res) => {
    db.user.findOne({
        where: {
            email: req.body.email
        }
    }).then((data) => {
        if (data) {
            return res.json({
                message: "Email already exist"
            });
        } else {
            rand = Math.floor((Math.random() * 100) + 54);
            host = req.get('host');
            // host = 'smtp.mailgun.org';
            link = "http://" + req.get('host') + "/verify?id=" + rand;
            mailOptions = {
                to: req.body.email,
                subject: "Please confirm your Email account",
                html: "Hello,Please Click on the link to verify your email. " + link + "Click here to verify"
            }
            console.log(mailOptions);
            transport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {

                    secretkey = randomstring.generate();
                    console.log(secretkey)
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(req.body.password, salt, (error, hash) => {
                            // passwordhash = hash
                            db.user.create({
                                email: mailOptions.to,
                                password: hash,
                                active: false,
                                secretkey
                            }).then((data) => {
                                res.json({
                                    message: 'You have Signed up. Kindly verify your account for login either by secret key or by clicking on the link in your email'
                                })
                            }).catch((error) => {
                                res.json({
                                    message: "Error : " + error
                                });
                            })
                        });
                    });


                }
            });
        }
    });
}

exports.verify = (req, res) => {
    // console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");

        const arr = req.query.id.split("")
        var idd = '';
        arr.forEach(no => {
            if (no == 'C' || no == 'c' || no == 'l' || no == 'i' || no == 'k') {
            } else {
                idd += no
            }
        })

        console.log(idd)
        console.log(rand)
        if (idd == rand) {
            db.user.update({
                // email: mailOptions.to,
                // password: passwordhash,
                active: true,
                secretkey: ''
            }, {
                where: {
                    email: mailOptions.to,
                    active: 0
                }
            }).then((data) => {
                res.json({
                    success: 1,
                    message: mailOptions.to + " is successfully verified",
                    data
                })
                // res.send(data)
            }).catch((error) => {
                res.json({
                    message: "Error : " + error
                });
            });
            // res.end("Email " + mailOptions.to + " is been Successfully verified");
            // res.json({
            //     success: 1,
            //     message
            // })
        }
        else {
            // console.log("email is not verified");
            res.json({
                message: "Bad Request, Email Not Verified"
            });
        }
    }
    else {
        res.end("Request is from unknown source");
    }
};

