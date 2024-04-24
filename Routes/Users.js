const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)
const jwt = require('jsonwebtoken');

//database
const db = require('../Connection');
const sendEmail = require('./Email');

//user regidtration api

router.post('/registerVerify' , (req, res) =>{
    const phoneNumber = req.body.phoneNumber;

    db.query(
        "SELECT * FROM users WHERE phoneNumber = ?",
        phoneNumber,
        (err, result) =>{
            if(err){
                res.send({message: "error", error: err});
            }
            else{
                if(result.length > 0){
                    res.send({message: "User Exists"});
                }
                else{
                    res.send({message: "ok"});
                }
            }
        }
    );
});


router.post("/register", (req,res) =>{
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword; 

    const time = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');// Format: YYYY-MM-DD HH:mm:ss

    let userType  = "user";

    if(req.body.userType){
        //if userType is admin then he/she has emailAddress
        userType = req.body.userType;

    }

    const q1 = "SELECT * FROM users WHERE phoneNumber = ?";
    db.query(q1, phoneNumber, (err1, result1) => {
        if(err1){
            res.send({error: err1});
        }
        else{
            if(result1.length > 0){
                res.send({message: "Phone Number is already exists!"});
            }
            else{
                if(password === confirmPassword){
                    bcrypt.hash(password, 10, (err, hashPassword) => {
                    if(err){
                        res.send({error: err});//password bcrypt has an error
                    }
                    else{db.query(
                            "INSERT INTO users(fullName, phoneNumber, password, userType, dateTime) VALUES(?, ?, ?, ?, ?)",
                            [fullName, phoneNumber, hashPassword, userType,time],
                            (err, result)=>{
                                if(err){
                                    res.send({message: "query error", error: err});
                                }
                                else{
                                    res.send({message: "success"});
                                }
                            });
                    }});
                }
                else{
                    res.send({message: "Password is incorect"});
                }    
            }
        }
    })

    
});

//User Login api

router.post("/login", (req, res) =>{
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE phoneNumber=?",
        phoneNumber,
        (err, result) =>{
            if(err){
                res.send({error: err});//query error
            }
            else if(result.length >0){
                bcrypt.compare(password, result[0].password, (err1, response) =>{
                    if(response){
                        //create jwt token
                        const token = jwt.sign({id: result[0].userId, userType: result[0].userType}, process.env.JWT_SECRET_KEY);//create jwt token

                        //omit password
                        const {password, ...currentUser} = result[0];

                        if(currentUser.userType == 'admin'){
                            db.query(
                                "SELECT * FROM adminuser WHERE userId =?",
                                result[0].userId,
                                (err, adminResult) =>{
                                    if(err){
                                        res.send({error: err});
                                    }
                                    else{
                                        // omit userId from admin details
                                        const {userId, ...others} = adminResult[0];
                                        //add admin details to current detsails and save in updateCurrentUser
                                        const updateCurrentUser = {...currentUser, ...others};

                                        res.cookie("accessToken", token,{
                                            httpOnly: true,
                                            maxAge: 24 * 60 * 60 * 1000,
                                        }).status(200).json({message:"success", currentUser:updateCurrentUser})
                                    }
                                }
                            )
                        }
                        else{
                            res.cookie("accessToken", token, {
                                httpOnly: true,
                            }).status(200).json({message:"success", currentUser:currentUser});
                        } 
                    }
                    else{
                       res.send({message: "password incorrect"});
                       
                    }
                });
            }
            else{
                res.send({message: "User doesn't exist"});
            }
        }
    );
});

//user identify

router.post('/userIdentify' , (req, res) =>{
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE phoneNumber=?",
        phoneNumber,
        (err, result) =>{
            if(err){
                res.send({error: err});//query error
            }
            else if(result.length >0){
                bcrypt.compare(password, result[0].password, (err1, response) =>{
                    if(response){
                        res.send({message: "success", userType: result[0].userType}); 
                    }
                    else{
                       res.send({message: "password incorrect"});
                       
                    }
                });
            }
            else{
                res.send({message: "User doesn't exist"});
            }
        }
    );
});


router.get('/sendOTP', (req, res) =>{
    const phoneNumber = req.query.phoneNumber;
    
    const OTPnum = Math.floor(100000 + Math.random() * 900000);
  
    console.log(OTPnum);//for now see the OTP number

    email = '2000Ravindudeshitha@gmail.com';
    subject ="OTP";
    firstName ='dear';
    sendEmail(email,subject,firstName,OTPnum);

    res.send(String(OTPnum));
});



//userType update api

router.put('/systemUser/:id', (req, res) => {
    
    const userId = req.params.id;

    const fullName = req.body.fullName;
    const phoneNumber = req.body.phoneNumber;
    const userType = req.body.userType;
    

    db.query(
        "UPDATE users SET fullName = ? , phoneNumber= ? ,userType = ? WHERE userId = ?",
        [fullName, phoneNumber, userType, userId],
        (err, result) =>{
            if(err){
                res.send({message:"query error", error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    );
});

//verify admin user

router.get('/verifyAdmin', (req, res) =>{
    const token = req.cookies.accessToken;
    if (!token){
        res.send("Not authenticated!");
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
            if(err){
                res.send("Token is not valid!");
            } 
            else{
                db.query(
                "SELECT userType FROM users WHERE userId = ?",
                userInfo.id,
                (err,result) =>{
                    if(err){
                        res.send("Internal server error");
                    }
                    else{
                        if(result[0].userType === 'admin'){
                            res.send('pass');
                        }
                        else{
                            res.send('fail');
                        }
                    }
                }
            )
            }
            
            
        });
    }
});



//get user

router.get('/systemUser', (req,res)=>{
    const phoneNumber = req.body.phoneNumber;

    db.query(
        "SELECT * FROM users WHERE phoneNumber = ?",
        phoneNumber,
        (err,result)=>{
            if(err){
                res.send({message: "query error"});
            }
            else{
                res.send({userId : result[0].userId});
            }
        }
    );

});

router.post("/logout", (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
    }).status(200).json("User has been logged out.")
});



module.exports = router;