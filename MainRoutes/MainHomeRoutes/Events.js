const express = require('express');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');

    const receivedTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

router.get('/events', (req, res) =>{

    db.query(
        "SELECT * FROM event",
        (err, result) =>{
            if(err){
                res.send({message: "get events query error", error : err});
            }
            else{
                res.send({message: "Get events success", result : result});
            }
        }
    );
});

router.get('/events/:id', (req, res) =>{
    const eventId = req.params.id;

    db.query(
        "SELECT * FROM event WHERE eventId=?",
        [eventId],
        (err, result) =>{
            if(err){
                res.send({message: "get events query error", error : err});
            }
            else{
                res.send({message: "Get events success", result : result[0]});
            }
        }
    );
});
module.exports = router;