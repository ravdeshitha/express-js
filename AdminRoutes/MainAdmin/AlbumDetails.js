const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../../Connection');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');

router.post('/album',AuthorizeAdmin, (req, res) =>{

    const albumName = req.params.albumName;
    const category = req.params.category;
    const albumType = req.params.albumType;
    const adminId = req.params.adminId;

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    db.query(
        "INSERT INTO album (albumName, category, albumType, adminId) VALUES (?, ?, ?, ?, ?)",
        [albumName, category, albumType, adminId],
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

router.delete('/album/:id',AuthorizeAdmin, (req, res) =>{

    const albumId = req.params.id;

    db.query(
        "DELETE FROM album WHERE albumId =?",
        [albumId],
        (err, result) =>{
            if(err){
                res.send({message: "query error", error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    )
})

module.exports = router;