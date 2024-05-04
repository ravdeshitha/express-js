const express = require('express');
const router = express.Router();
const db = require('../../Connection');
const moment = require('moment-timezone');//moment lybrary for get the current time(sri lanka)


router.get('/countdown', (req, res) =>{
    const currentYear = new Date().getFullYear();
    const years = currentYear - 1995;

    db.query(
        "SELECT employees, projects FROM countdown",
        (err, result) =>{
            if(err){
                res.send({message: "query error", error: err});
            }
            else{

                db.query(
                    "SELECT count(*) AS services FROM services",
                    (err2, result2) =>{
                        if(err2){
                            res.send({message: "query error", error: err});
                        }
                        else{
                            const responseData = [
                                { employees: result[0].employees, projects: result[0].projects, services: result2[0].services, years: years   }
                            ];
                            res.send({ message: "success", result: responseData });
                        }
                    }
                )
                
            }
        }
    )
});

module.exports = router;