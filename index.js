require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const app = express();

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Credentials', true);
    next();
})
app.use(express.json());
app.use(cors({
    origin: "https://react-kappa-sooty.vercel.app/",
}));
app.use(cookieParser());
app.use(express.static('public'));//this is for give the access to public folder to front end


//main routes paths
const usersRoute = require('./Routes/Users');//sign in, sign up, user editings

//admin route path
const adminBoard = require('./AdminRoutes/AdminBoard');

//main home page path
const mainHome = require('./MainRoutes/MainHome');

//image upload route(multer- public/images folder in server)



//asign routers
app.use('/api/user', usersRoute);//signUp, Signin 
app.use('/api/adminBoard',adminBoard);//Admin panel main branche
app.use('/api/mainHome', mainHome); //Main home page branche




app.listen(process.env.PORT, () =>{
    console.log("server running...");
})
