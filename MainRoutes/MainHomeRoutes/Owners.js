const express = require('express');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');


router.get('/owners' , (req, res) =>{

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

router.get('/ceofounder' , (req, res) =>{
    const ceo = 'ceo';
    const founder = 'founder';

    db.query(
        "SELECT * FROM owners WHERE ownerType=? OR ownerType=?",
        [ceo,founder],
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

router.get('/derectors' , (req, res) =>{
    const ceo = 'ceo';
    const founder = 'founder';

    db.query(
        "SELECT * FROM owners WHERE ownerType!=? AND ownerType!=?",
        [ceo,founder],
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


module.exports = router;