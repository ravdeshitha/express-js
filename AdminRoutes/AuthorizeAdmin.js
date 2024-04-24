const jwt = require('jsonwebtoken');

function AuthorizeAdmin(req, res, next) {
    const token = req.cookies.accessToken;

    if(!token){
        return res.send({message:"Unauthorized"});
    }

    jwt.verify(token,process.env.JWT_SECRET_KEY, (err,decoded) =>{
        if(err){
            return res.send({message: "token expired or invalid"});
        }

        if(decoded.userType !== 'admin'){
            return res.send({message: "forbidden"});
        }

        req.user = decoded;
        next();
    });
}

module.exports = {AuthorizeAdmin};