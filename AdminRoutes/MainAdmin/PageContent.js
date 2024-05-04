const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../../Connection');
const { upload,deleteImages,deleteImage } = require('../../imageUpload/Upload');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');

router.post('/content/services', AuthorizeAdmin, upload.array('seviceIMG'), (req, res)=>{
    const images = req.files.map(file => file.key);

    const serviceDataString = req.body.serviceData;
    const serviceData = JSON.parse(serviceDataString);

    const nameColor = JSON.parse(req.body.nameColor);
    const titleColor = JSON.parse(req.body.titleColor);
    
    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const values = [serviceData.serviceName,serviceData.serviceTitle, serviceData.serviceDesc, images[0], images[1], images[2], serviceData.serviceUrl,nameColor, titleColor,dateTime, serviceData.modifiedBy];

    db.query(
        "INSERT INTO services(serviceName, serviceTitle, serviceDesc, logoImg, img1, img2, serviceUrl,nameColor, titleColor, addTime, modifiedBy) VALUES (?)",
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
    )
});

router.get('/content/services', AuthorizeAdmin, (req, res) =>{
    db.query(
        "SELECT * FROM services",
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


router.put('/content/services',AuthorizeAdmin, upload.array('seviceIMG'), (req, res) => {
    const images = req.files.map(file => file.key);
    
    const serviceDataString = req.body.serviceData;
    const serviceData = JSON.parse(serviceDataString);

    const nameColor = JSON.parse(req.body.nameColor);
    const titleColor = JSON.parse(req.body.titleColor);
    
    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    let imageNumbers = req.body.imageNumber;

    if (!Array.isArray(imageNumbers)) {
        imageNumbers = [imageNumbers];
    }

    imageNumbers.sort((a, b) => a - b);
    
    const setImages = ['no', 'no', 'no'];
    
    for (let i = 0; i < imageNumbers.length; i++) {
        if (images[i]) {
            setImages[imageNumbers[i]] = images[i];
        }
    }
    

    db.query(
        "SELECT logoImg, img1, img2 FROM services WHERE serviceId=?",
        serviceData.serviceId,
        (err, serviceResult) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Error occurred while retrieving event data" });
                return;
            }

            const imageNames = [serviceResult[0].logoImg, serviceResult[0].img1, serviceResult[0].img2];
            let prevImages = [];

            for (let i = 0; i < 3; i++) {
                if (setImages[i] === 'no') {
                    setImages[i] = imageNames[i];
                } else {
                    prevImages.push(imageNames[i]);
                }
            }
            
            //images are filled using prev and update images
            const values = [serviceData.serviceName, serviceData.serviceTitle, serviceData.serviceDesc,setImages[0], setImages[1], setImages[2], serviceData.serviceUrl,nameColor,titleColor, dateTime, serviceData.modifiedBy, serviceData.serviceId];
            
            db.query(
                "UPDATE services SET serviceName=?,serviceTitle=?, serviceDesc=?, logoImg=?, img1=?, img2=?,serviceUrl=?,nameColor=?, titleColor=?, addTime=?, modifiedBy=? WHERE serviceId=?",
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

router.delete('/content/services/:id', AuthorizeAdmin, (req, res) =>{
    const serviceId = req.params.id;
    db.query(
        "DELETE FROM services WHERE serviceId =?",
        serviceId,
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



router.post('/content/slideImage',AuthorizeAdmin,upload.single('slideIMG'), (req, res) =>{
    const slideImage = req.file.key;

    const slideDataString = req.body.slideData;
    const slideData = JSON.parse(slideDataString);

    const uploadedBy	 = slideData.uploadedBy	;

    const editTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    db.query(
        "INSERT INTO slideshow_images (imageUrl,uploadTime,uploadedBy) VALUES (?, ?, ?)",
        [slideImage, editTime, uploadedBy],
        (err, result) =>{
            if(err){
                deleteImage(slideImage);
                res.send({message:"query error", error: err});
            }
            else{
                res.send({message: "success", result: result});
            }
        }
    );

});

router.get('/content/slideImage', AuthorizeAdmin, (req, res) =>{
    db.query(
        "SELECT * FROM slideshow_images",
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

router.delete('/content/slideImage/:id', AuthorizeAdmin, (req, res) =>{
    const slideId = req.params.id;
    db.query(
        "DELETE FROM slideshow_images WHERE slideId =?",
        slideId,
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

router.get('/content/countdown', AuthorizeAdmin, (req, res) =>{
    db.query(
        "SELECT * FROM countdown",
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

router.put('/content/countdown', AuthorizeAdmin, (req, res) =>{
    const countdownId = req.body.countdownId;
    const employees = req.body.employees;
    const projects = req.body.projects;
    const modifiedBy = req.body.modifiedBy;

    const editTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
    
    db.query(
        "UPDATE countdown SET employees =?, projects = ?, modifyTime =?, modifiedBy =? WHERE countdownId = ?",
        [employees, projects, editTime, modifiedBy, countdownId],
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

module.exports = router;