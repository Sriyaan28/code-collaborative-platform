import jwt from 'jsonwebtoken';
const {verify} = jwt;

import { config } from 'dotenv';
config();

// To access cookies properties of req object, we need cookie parser middleware.
// Otherwise req.cookies is undefined
export function verifyToken(req,res,next)
{
    // console.log("Token is ",req.cookies.token)
    // token verification logic
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if(!token)
    {
        return res.status(401).json({message:"Unauthorised"})
    }
    try
    {
        // if token exists
        const decodedToken = verify(token,process.env.JWT_SECRET)   // returns error if token invalid
        console.log(decodedToken)
        req.user = decodedToken 
        next();
    }
    catch(err)
    {
        res.status(401).json({message:"Session expired, Login again"})
    }
}