const express = require('express');
const multer = require('multer');
const sendEmail = require('../../Routes/Email');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');
const upload = multer({dest: 'upload/'});
const jwt = require('jsonwebtoken');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');

router.post('/sendEmail/:id',AuthorizeAdmin, upload.array('attachments', 5), async (req, res) => {
    const msgId = req.params.id;

    const replyString = req.body.reply;
    const reply = JSON.parse(replyString);

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    // Check if the user is logged in
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Unauthorized: Not logged in");

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, userInfo) => {
        if (err) return res.status(403).send("Forbidden: Token is not valid");

        try {
            // Process attachments if present
            let attachments = [];
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    attachments.push({
                        filename: file.originalname,
                        content: file.buffer
                    });
                }
            }

            // Send email with attachments
            await sendEmail(reply.email, reply.subject, reply.firstName, reply.replyMsg, attachments, reply.prevMsg);

            const msgState = 'replied';
            
            // Update database with replyAdmin and msgState
            db.query(
                "UPDATE guest_contact SET replyMsg=?, replyTime=?, replyAdmin=?, msgState=? WHERE msgId =?",
                [reply.replyMsg, dateTime, reply.replyAdmin,msgState, msgId],
                (err, result) => {
                    if (err) {
                        console.error('Database query error:', err);
                        res.status(500).send({ message: 'query error', error: err });
                    } else {
                        res.status(200).send({ message: 'success', result: result });
                    }
                }
            );
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    });
});


router.get('/contact',AuthorizeAdmin, (req, res) =>{
    const token = req.cookies.accessToken;
    if(!token) return res.send("not Logged in");

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if(err) return res.send("Token is not valide!");
        db.query(
            "SELECT * FROM guest_contact ORDER BY receivedTime DESC",
            (err, result) =>{
                if(err){
                    res.send({message:'query error', error: err});
                }
                else{
                    res.send({message:'success', result: result});
                }
            }
        );
    });
});

router.get('/contact/:id',AuthorizeAdmin, (req, res) =>{
    const msgId = req.params.id;

    db.query(
        "SELECT * FROM guest_contact WHERE msgId=?",
        [msgId],
        (err, result) =>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:'success', result: result[0]});
            }
        }
    );
});

router.delete('/contact/:id',AuthorizeAdmin, (req, res) =>{
    const msgId = req.params.id;

    db.query(
        "DELETE FROM guest_contact WHERE msgId=?",
        [msgId],
        (err, result) =>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:' success', result: result});
            }
        }
    );
});

router.put('/contact/:id',AuthorizeAdmin, (req, res) =>{
    const msgId = req.params.id;
    const msgState = req.body.msgState;

    db.query(
        "UPDATE guest_contact SET msgState=? WHERE msgId =?",
        [msgState, msgId],
        (err, result)=>{
            if(err){
                res.send({message:'query error', error: err});
            }
            else{
                res.send({message:'success', result: result});
            }
        }
    );
});

module.exports = router;