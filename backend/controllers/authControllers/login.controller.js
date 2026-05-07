import { hash,compare } from 'bcrypt'
import { UserModel } from '../../models/UserModel.js'
import jwt from 'jsonwebtoken'
const { sign } = jwt

import {config} from "dotenv";
config();

export const loginController = async (req,res)=>{
    try
    {
        // get user data from req
        const { email,password } = req.body
        // find user in db
        const currentUser=await UserModel.findOne({ email:email })

        // check if user exists
        if(!currentUser)
        {
            return res.status(400).json({message:"Invalid user email"})
        }

        // check if user is active
        if(!currentUser.isActive)
        {
            return res.status(400).json({message:"User profile is deactivated."})
        }

        //check if passwords match
        const isMatched=await compare(password,currentUser.password)

        //Return message if passwords doesnt match
        if(!isMatched)
        {
            return res.status(400).json({message:"Invalid user password"})
        }
        // generate token
        const token=sign({id:currentUser._id,email:currentUser.email},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        // remove password from user object
        const userObj = currentUser.toObject()
        delete userObj.password

        // send response
        return res.status(200).json({message:"User login successful", payload:userObj})
    }
    catch(error)
    {
        res.status(500).json({message:"Internal server error"})
    }
}