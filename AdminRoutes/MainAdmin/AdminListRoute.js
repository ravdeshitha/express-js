const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)
const db = require('../../Connection');
const {upload, deleteImage} = require('../../imageUpload/Upload');
const { AuthorizeAdmin } = require('../AuthorizeAdmin');

router.get('/adminUsers',AuthorizeAdmin, (req, res) =>{
   
    db.query(
        "SELECT users.userId, users.fullName, users.phoneNumber, adminuser.email, adminuser.adminId, adminuser.photo FROM users JOIN adminuser ON users.userId = adminuser.userId",
        (err,result) =>{
            if(err){
                console.log("query error" + err);
            }
            else{
                res.send(result);
            }
        }
    );
});

//register admin user with uploading image

router.post('/adminUsers',AuthorizeAdmin,upload.single('adminIMG'), async(req, res)=>{
    const photo = req.file.key;

    const adminDataString = req.body.adminData;//get the JSON string from the request body
    const adminData = JSON.parse(adminDataString);//convert json to object

    const fullName = adminData.fullName;
    const phoneNumber = adminData.phoneNumber;
    const password = adminData.password;
    const confirmPassword = adminData.confirmPassword;
    const adminId = adminData.adminId;
    const email = adminData.email;
    const asignedDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');// Format: YYYY-MM-DD HH:mm:ss

    const registerAdmin =  await axios.post('http://localhost:8080/api/user/register',{
        fullName: fullName,
        phoneNumber: phoneNumber,
        password: password,
        confirmPassword: confirmPassword,
        userType: 'admin'
    });


    if(registerAdmin.data.message == 'success'){
        
        db.query(
            "SELECT userId FROM users WHERE phoneNumber =?",
            [phoneNumber],
            (err, result) =>{
                if(err) {
                    console.log(err);
                }

                const userId = result[0].userId;

                db.query(
                    "INSERT INTO adminuser (adminId, userId, email, photo, asignedDate) VALUES (?,?,?,?,?)",
                    [adminId, userId, email, photo, asignedDate],
                    (err, result) =>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.send({message: 'success', result: result});
                        }
                    }
                );
            }
        )
    }
    else{
        //if user registration has an error then uploaded image should delete
        deleteImage(photo);
        //send the user registration error status to front end
        res.send({message:"Admin User Registration fail", error: registerAdmin.data});
    }
});

//update admin user with image

router.put('/adminUsers/:id',AuthorizeAdmin,upload.single('adminIMG'), async(req,res) =>{
    const userId = req.params.id;
    

    const adminDataString = req.body.updateAdminData;//get the JSON string from the request body
    const adminData = JSON.parse(adminDataString);//convert json to object

    const fullName = adminData.fullName;
    const phoneNumber = adminData.phoneNumber;
    const password = adminData.password;
    const confirmPassword = adminData.confirmPassword;
    const adminId = adminData.adminId;
    const email = adminData.email;
    const asignedDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');

    let photo;
    if(req.file){
        photo = req.file.key;
    }
    else{
        photo = adminData.photo;
    }

    const selectResult = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM adminuser WHERE userId=?", userId, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    if (selectResult.length > 0) {
        const user = selectResult[0]; // Assuming you're only expecting one user
        const updateAdmin = await axios.put(`http://localhost:8080/api/user/systemUser/${userId}`, {
            fullName: fullName,
            phoneNumber: phoneNumber,
            password: password,
            confirmPassword: confirmPassword,
            userType: 'admin'
        });
    
        if (updateAdmin.data.message === 'success') {
            db.query(
                "UPDATE adminuser SET adminId =?, email=?, photo=?, asignedDate=? WHERE userId=?",
                [adminId, email, photo, asignedDate, userId], // Add userId to the WHERE clause
                (err, result) => {
                    if (err) {
                        res.send({ message: err });
                    } else {
                        // Assuming photo is in user object, otherwise replace user.photo with correct property
                        if(req.file){
                            deleteImage(user.photo);
                        }
                        res.send({ message: "admin update successfull", result: result });
                    }
                }
            );
        } else {
            if(req.file){
                deleteImage(photo);
            }
            res.send("admin user update fail");
        }
    } else {
        if(req.file){
            deleteImage(photo);
        }
        res.send("User Not exists");
    }
});


router.delete('/adminUsers/:id',AuthorizeAdmin, (req, res) =>{
    const adminId = req.params.id;
    const photo = req.body.photo;

    db.query(
        "DELETE FROM users WHERE userId =(SELECT userId FROM adminuser WHERE adminId = ?)",
        [adminId],
        (err, result) => {
            if(err){
                res.send({message : err});
            }
            else{
                deleteImage(photo);
                res.send({message: "Delete successfull" , result: result});
            }
        }
    )
    
})

module.exports = router;