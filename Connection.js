const mysql = require('mysql');

//connect to the MYSQL database
const db = mysql.createConnection({
    host: "beuox4ifr1kb539oxw1s-mysql.services.clever-cloud.com",
    user: "ujh8spdyfs8dq5fr",
    password: "U2Si6z4OKIsjRLIuLylN",
    database: "beuox4ifr1kb539oxw1s"
});

db.connect((err) =>{
    if(err){
        console.log("database connection error" ,err);
    }
    else{
        console.log("database connection sucessfully ");
    }
});


module.exports = db;
