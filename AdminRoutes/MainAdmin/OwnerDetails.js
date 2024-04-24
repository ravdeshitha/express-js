const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../../Connection');
const { upload,deleteImage } = require('../../imageUpload/Upload');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');


router.post('/owners',AuthorizeAdmin,upload.single('ownerIMG'), (req, res) =>{
    const ownerImage = req.file.key;

    const ownerDataString = req.body.ownerData;
    const ownerData = JSON.parse(ownerDataString);

    const ownerName = ownerData.ownerName;
    const ownerType = ownerData.ownerType;
    const editedByAdmin = ownerData.editedByAdmin;

    const editTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    db.query(
        "INSERT INTO owners (ownerName, ownerImage, ownerType, editedByAdmin, editTime) VALUES (?, ?, ?, ?, ?)",
        [ownerName, ownerImage, ownerType, editedByAdmin, editTime],
        (err, result) =>{
            if(err){
                deleteImage(ownerImage);
                res.send({message:"query error", error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    );

});


router.get('/owners',AuthorizeAdmin , (req, res) =>{

    db.query(
        "SELECT * FROM owners",
        (err, result) =>{
            if(err){
                res.send({message: "get owners query error", error: err});
            }
            else{
                res.send({message: 'gett owners success', result: result});
            }
        }
    );
});

router.get('/owners/:id',AuthorizeAdmin, (req, res) =>{

    const ownerId = req.params.id;

    db.query(
        "SELECT * FROM owners WHERE ownerId =?",
        [ownerId],
        (err, result)=>{
            if(err){
                res.send({message: err});
            }
            else{
                res.send({message: 'success', result: result[0]});
            }
        }
    );
});

router.put('/owners/:id',AuthorizeAdmin, upload.single('ownerIMG'), (req, res) => {
    const ownerDataString = req.body.ownerData;
    const ownerData = JSON.parse(ownerDataString);

    const ownerId = req.params.id;
    let ownerImage = ownerData.ownerImage;
    let prevImg = null; // Initialize prevImg to null

    if (req.file) {
        prevImg = ownerImage;
        ownerImage = req.file.key;
    }

    const ownerName = ownerData.ownerName;
    const ownerType = ownerData.ownerType;
    const editedByAdmin = ownerData.editedByAdmin;
    const editTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    console.log(ownerName, prevImg, ownerImage, ownerType, editedByAdmin, editTime);

    db.query(
        "UPDATE owners SET ownerName=?, ownerImage=?, ownerType=?, editedByAdmin=?, editTime=? WHERE ownerId=?",
        [ownerName, ownerImage, ownerType, editedByAdmin, editTime, ownerId],
        (err, result) => {
            if (err) {
                if (prevImg) { // Check if prevImg is defined before deleting
                    deleteImage(prevImg);
                }
                res.send({ message: "Query error", result: err });
            } else {
                if (prevImg) { // Check if prevImg is defined before deleting
                    deleteImage(prevImg);
                }
                res.send({ message: "Update success", result: result });
            }
        }
    );
});

router.delete('/owners/:id',AuthorizeAdmin, (req, res) =>{

    const ownerId = req.params.id;
    const ownerImage = req.query.ownerImage;

    db.query(
        "DELETE FROM owners WHERE ownerId = ?",
        [ownerId],
        (err, result) =>{
            if(err){
                res.send({message:"query erro", error: err});
            }
            else{
                deleteImage(ownerImage);
                res.send({message: "success", result: result});
            }
        }
    )

});

module.exports = router;