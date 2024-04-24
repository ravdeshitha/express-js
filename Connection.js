const mysql = require('mysql');

//connect to the MYSQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wasana_company"
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