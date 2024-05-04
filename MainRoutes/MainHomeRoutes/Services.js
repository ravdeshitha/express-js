const express = require('express');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)


router.get('/services', (req, res) =>{
    
    db.query(
        "SELECT * FROM services",
        (err, result) =>{
            if(err){
                res.send({message: "query error", error: err});
            }
            else{
                res.send({ message: "success", result: result });
            }
        }
    )
});

module.exports = router;