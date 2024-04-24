const {S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");
const path = require('path');

//configer AWS 

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        secretAccessKey: process.env.ACCESS_SECRET_AWS,
        accessKeyId: process.env.ACCESS_KEY_AWS
    }
});

const BUCKET_NAME = process.env.BUCKET_NAME;

//image upload
const upload = multer({
    storage: multerS3({
        s3 : s3Client,
        bucket : BUCKET_NAME,
        metadata : function (req, file, cb){
            cb(null, { filedName : file.fieldname});
        },
        key : function (req, file, cb){
            cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
        }
    })
})

//Delete a image

const deleteImage = async(image) =>{
    const imageName = image;
    try{
        const command = new DeleteObjectCommand({Bucket : BUCKET_NAME, Key : imageName});
        
        await s3Client.send(command);
        console.log("Delete Success");
    }   
    catch(err){
        console.log(image + " is not exists in storage");
    }
}

//Delete multiple images

const deleteImages = async(images) =>{
    try{
        for(let i =0; i< images.lengt; i++){
            const imageName = images[i];

            const command = new DeleteObjectCommand({Bucket : BUCKET_NAME, Key : imageName});
        
            await s3Client.send(command);
            console.log(images[i] + " DeleteSuccess");
            }
    }
    catch(err){
        console.log("server error", err);
    }
}

module.exports ={
    deleteImages: deleteImages,
    deleteImage : deleteImage,
    upload : upload
}