const jwt=require('jsonwebtoken');
const JWT_SECRET = "Up78@2051verysecret";

const fetchuser= (req,res,next)=>{
    // Get the user from jwtToken and add id to request object
        const token = req.header('auth-token');

    try{
        if(!token){
            return res.status(401).json({error:"Please authenticate using a valid token"});
        }else{
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data.user;
            next();
        }
    } catch (err) {
        return res.status(401).json({error:"Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;