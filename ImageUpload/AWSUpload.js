
const {S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const fs = require("fs");

//configer AWS 

const s3Client = new S3Client({
    region: process.env.REGION,
    Credentials:{
        secreteAccessKey: process.env.ACCESS_SECRET_AWS,
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
            cb(null, file.originalname);
        }
    })
})


//Delete a image

const deleteImage = async(image) =>{
    const imageName = image;
    try{
        const command = new DeleteObjectCommand({Bucket : BUCKET_NAME, Key : imageName});
        
        await s3Client.send(command);
        console.log("DeleteSuccess");
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
        console.log(image + " is not exists in storage");
    }
}

module.exports ={
    deleteImages: deleteImages,
    deleteImage : deleteImage,
    upload : upload
}


// require("dotenv").config();

// const express = require('express');
// const { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const fs = require('fs');



// const app = express();
// app.use(express.json());

// app.listen(8080);


// //configer aws 
// const s3Client = new S3Client({
//     region: process.env.REGION,
//     credentials: {
//         secretAccessKey: process.env.ACCESS_SECRET_AWS,
//         accessKeyId: process.env.ACCESS_KEY_AWS
//     }
// });

// const BUCKET_NAME = process.env.BUCKET_NAME;

// const upload = multer({
//     storage: multerS3({
//         s3: s3Client,
//         bucket: BUCKET_NAME,
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, file.originalname);
//         }
//     })
// });

// app.post('/upload', upload.single('file'), async function (req, res, next) {
//     res.send('Successfully uploaded ' + req.file.location + ' location!');
// });

// app.get("/list", async (req, res) => {
//     try {
//         const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
//         const response = await s3Client.send(command);
//         const keys = response.Contents.map(item => item.Key);
//         res.send(keys);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// app.get("/download/:filename", async (req, res) => {
//     const filename = req.params.filename;
//     try {
//         const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename });
//         const response = await s3Client.send(command);
//         const fileStream = response.Body;
//         fileStream.pipe(res);
//     } catch (error) {
//         console.error(error);
//         res.status(404).send("File Not Found");
//     }
// });

// app.delete("/delete/:filename", async (req, res) => {
//     const filename = req.params.filename;
//     try {
//         const command = new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: filename });
//         await s3Client.send(command);
//         res.send("File Deleted Successfully");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });
