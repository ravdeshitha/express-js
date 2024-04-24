const express = require('express');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)

router.post('/guestMessage', (req, res) =>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const subject = req.body.subject;
    const message = req.body.message;
    const receivedTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    const msgState = "no";
    const replyMsg = "";
    const replyTime = "";
    const replyAdmin = "AM01";

    db.query(
        "INSERT INTO guest_contact (firstName, lastName, email, phoneNumber, subject, message, receivedTime, msgState, replyMsg, replyTime, replyAdmin) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        [firstName, lastName, email, phoneNumber, subject, message, receivedTime, msgState, replyMsg, replyTime, replyAdmin],
        (err,result)=>{
            if(err){
                res.send({err});
            }
            res.send("sucess");
        }
    )


})

module.exports = router;