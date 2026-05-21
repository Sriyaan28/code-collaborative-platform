import {hash} from 'bcrypt';
import { UserModel } from '../../models/UserModel.js';

export const registerController = async(req,res)=>{
    try
    {
        // get user data from req 
        const newUser = req.body

        // check if user already exists
        const existingUser = await UserModel.findOne({ email: newUser.email })
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use", success: false })
        }

        // hash password
        newUser.password = await hash(newUser.password,12)

        // create new user
        const newUserDoc = new UserModel(newUser)

        // save user
        await newUserDoc.save()

        return res.status(201).json({ message: "User Registration Successful"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({message:"User Registration failed",error:err})
    }
}