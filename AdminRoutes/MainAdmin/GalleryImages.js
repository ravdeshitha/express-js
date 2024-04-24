const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const db = require('../../Connection');
const jwt = require('jsonwebtoken');
const { upload,deleteImage, deleteImages } = require('../../imageUpload/Upload');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');


////////////////////////////////////////////////////////
//ALBUM DETAILS HANDLING ROUTERS////////////////////////
////////////////////////////////////////////////////////
router.post('/album',AuthorizeAdmin, (req, res) =>{
    const albumName = req.body.albumName;
    const category = req.body.category;
    const albumType = req.body.albumType;
    const adminId = req.body.adminId;
    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const values = [albumName, category, albumType, adminId, dateTime];

    db.query(
        "INSERT INTO album(albumName, category, albumType, adminId, dateTime) VALUES (?)",
        [values],
        (err, result) =>{
            if(err){
                res.send({error: err});
            }
            else{
                res.send({message: 'success'});
            }
        }
    );
});

router.get('/album',AuthorizeAdmin , (req, res) =>{
    db.query(
        "SELECT * FROM album",
        (err,result) =>{
            if(err){
                res.send({message:'unsuccess', error: err});
            }
            else{
                res.send({message: 'success', result});
            }
        }
    )
});

router.delete('/album/:id',AuthorizeAdmin, (req, res) => {
    const albumId = req.params.id;
    
    db.query(
        "SELECT imgURL FROM galleryimages WHERE albumId = ?",
        albumId,
        (err, imgresult) =>{
            if(err){
                res.send({message:" err" , error: err});
            }
            else{

                db.query(
                    "DELETE FROM album WHERE albumId = ?",
                    albumId,
                    (err, result) =>{
                        if(err){
                            res.send({error: err});
                        }
                        else{
                            if (imgresult && imgresult.length > 0) {
                                const imgs = imgresult.map(row => row.imgURL);
                                deleteImages(imgs);
                                db.query(
                                    "DELETE FROM galleryimages WHERE albumId = ?",
                                    albumId,
                                    (err, result) =>{
                                        if(err){
                                            res.send({error: err});
                                        }
                                        else{
                                            res.send({message: 'success', result});
                                        }
                                    }
                                )
                            } 
                        }
                    }
                );
            }
        }
    )
});

////////////////////////////////////////////////////////
//POSTER DETAILS HANDLING ROUTERS////////////////////////
////////////////////////////////////////////////////////
router.post('/poster',AuthorizeAdmin,upload.single('posterIMG'), (req, res) =>{
    const posterImage = req.file.key;

    const posterDataString = req.body.posterData;
    const posterData = JSON.parse(posterDataString);

    const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    const values = [posterImage, posterData.albumId, posterData.adminId, dateTime];
        
    db.query(
        "INSERT INTO galleryimages(imgURL, albumId,adminId,dateTime) VALUES (?)",
        [values],
        (err, result) =>{
            if(err){
                res.send({error: err});
            }
            else{
                res.send({message: 'success'});
            }
        }
    );
});

router.get('/posterAlbum',AuthorizeAdmin, (req, res) => {
    db.query(
        "SELECT i.imgId, i.imgURL, i.albumId, a.albumName, a.category, a.albumType FROM galleryimages AS i JOIN album AS a ON i.albumId = a.albumId WHERE a.albumType = ?",
        ['Event'],
        (err, result) =>{
            if(err){
                res.send({error: err});
            }
            else{
                res.send({message: 'success', result});
            }
        }
    );
});

router.delete('/poster/:id/:url',AuthorizeAdmin, (req, res) => {
    const imgId = req.params.id;
    const imgURL = req.params.url;
    
    db.query(
        "DELETE FROM galleryimages WHERE imgId = ?",
        imgId,
        (err, result) =>{
            if(err){
                res.send({error: err});
            }
            else{
                deleteImage(imgURL);
                res.send({message: 'success', result});
            }
        }
    );
});

///////////////////////////////////////////////////////////
/////////////Photos routers////////////////////////////////
///////////////////////////////////////////////////////////

router.post('/photos',AuthorizeAdmin, upload.array('glIMG'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.send({ error: 'No files uploaded' });
        }

        const posterImages = req.files.map(file => file.key);

        const photoDataString = req.body.photoData;
        const photoData = JSON.parse(photoDataString);

        const dateTime = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

        // Verify JWT token
        const token = req.cookies.accessToken;
        if (!token) {
            return res.send({ error: 'Not logged in' });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
            if (err) {
                return res.send({ error: 'Token is not valid' });
            }

            // Iterate over each image filename and insert into the database
            posterImages.forEach(imgURL => {
                const values = [imgURL, photoData.albumId, photoData.adminId, dateTime];
                db.query(
                    "INSERT INTO galleryimages (imgURL, albumId, adminId, dateTime) VALUES (?, ?, ?, ?)",
                    values,
                    (err, result) => {
                        if (err) {
                            console.error('Error inserting image into database:', err);
                        } else {
                            console.log('Image inserted successfully');
                        }
                    }
                );
            });

            return res.send({ message: 'Images uploaded successfully' });
        });
    } catch (error) {
        return res.send({ error: error.message });
    }
});



router.get('/photoAlbum',AuthorizeAdmin, (req, res) => {
    db.query(
        "SELECT i.imgId, i.imgURL, i.albumId, a.albumName, a.category, a.albumType FROM galleryimages AS i JOIN album AS a ON i.albumId = a.albumId WHERE a.albumType = ?",
        ['Photo'],
        (err, result) =>{
            if(err){
                res.send({error: err});
            }
            else{
                res.send({message: 'success', result});
            }
        }
    );
});


module.exports = router;