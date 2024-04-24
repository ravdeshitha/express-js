const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)
const db = require('../../Connection');
const {upload, deleteImage, deleteImages} = require('../../imageUpload/Upload');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');

router.post('/event',AuthorizeAdmin,upload.array('eventIMG',4), (req, res) =>{

    const images = req.files.map(file => file.key);

    const eventDataString = req.body.eventData;
    const eventData = JSON.parse(eventDataString);

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const values =[eventData.eventName,images[1] , images[0], images[2], images[3], dateTime, eventData.adminId];
    db.query(
        "INSERT INTO event (eventName, logoImg, coverImg, img1, img2, dateTime, adminId) VALUES (?)",
        [values],
        (err, result) =>{
            if(err){
                deleteImages(images);
                res.send({message: "query error", error: err});
            }
            else{
                res.send({message: 'success', result: result});
            }
        }
    );
});

router.get('/event',AuthorizeAdmin, (req, res) =>{

    db.query(
        "SELECT * FROM event",
        (err, result) =>{
            if(err){
                res.send({message: "query error", error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    )
});

router.get('/event/:id',AuthorizeAdmin, (req, res) =>{
    const eventId = req.params.id;

    db.query(
        "SELECT * FROM event WHERE eventId =?",
        [eventId],
        (err, result) =>{
            if(err){
                res.send({message: "query error", error: err});
            }
            else{
                res.send({message: "success", result: result[0]});
            }
        }
    )
});

router.put('/event',AuthorizeAdmin, upload.array('eventIMG', 4), (req, res) => {
    const images = req.files.map(file => file.key);
    
    const eventDataString = req.body.eventData;
    const eventData = JSON.parse(eventDataString);

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    let imageNumbers = req.body.imageNumber;

    if (!Array.isArray(imageNumbers)) {
        imageNumbers = [imageNumbers];
    }

    imageNumbers.sort((a, b) => a - b);

    const setImages = ['no', 'no', 'no', 'no'];

    for (let i = 0; i < imageNumbers.length; i++) {
        if (images[i]) {
            setImages[imageNumbers[i]] = images[i];
        }
    }


    db.query(
        "SELECT coverImg, logoImg, img1, img2 FROM event WHERE eventId=?",
        eventData.eventId,
        (err, eventResult) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Error occurred while retrieving event data" });
                return;
            }

            const imageNames = [eventResult[0].coverImg, eventResult[0].logoImg, eventResult[0].img1, eventResult[0].img2];
            let prevImages = [];

            for (let i = 0; i < 4; i++) {
                if (setImages[i] === 'no') {
                    setImages[i] = imageNames[i];
                } else {
                    prevImages.push(imageNames[i]);
                }
            }

            //images are filled using prev and update images
            const values = [eventData.eventName, setImages[1], setImages[0], setImages[2], setImages[3], dateTime, eventData.adminId, eventData.eventId];

            db.query(
                "UPDATE event SET eventName=?, logoImg=?, coverImg=?, img1=?, img2=?, dateTime=?, adminId=? WHERE eventId=?",
                values,
                (err, result) => {
                    if (err) {
                        console.log(err);
                        deleteImages(images);
                        res.status(500).send({ message: "Error occurred while updating event", error: err });
                    } else {
                        console.log("Success");
                        deleteImages(prevImages);
                        res.send({ message: "Event updated successfully", result: result });
                    }
                }
            );
        }
    );
});

router.delete('/event/:id',AuthorizeAdmin, (req, res) =>{
    const eventId = req.params.id;
    
    db.query(
        "SELECT coverImg, logoImg, img1, img2 FROM event WHERE eventId=?",
        eventId,
        (err, eventResult) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Error occurred while retrieving event data" });
                return;
            }

            const imageNames = [eventResult[0].coverImg, eventResult[0].logoImg, eventResult[0].img1, eventResult[0].img2];

            db.query(
                "DELETE FROM event WHERE eventId =?",
                [eventId],
                (err, result) =>{
                    if(err){
                        res.send({message: "query error", error: err});
                    }
                    else{
                        deleteImages(imageNames);
                        res.send({message: "success", result: result});
                    }
                }
            );
        }
    );

    
});


module.exports = router;