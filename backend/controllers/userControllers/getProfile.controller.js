import { UserModel } from "../../models/UserModel.js";

export const getProfileController = async(req,res)=>{
    try
    {
        // get user ID from the request token
        const uid = req.user?.id || req.user?._id

        // check if user ID is available in the request token
        if(!uid){
            return res.status(400).json({message:"User ID not found in request"})
        }

        // fetch user profile from the database
        const userProfile = await UserModel.findById(uid).select("-password") 

        // if user profile is not found, return 404
        if(!userProfile){
            return res.status(404).json({message:"User profile not found"})
        }

        // return user profile to the client
        res.status(200).json({message:"User profile fetched successfully", payload:userProfile})
    }
    catch(err)
    {
        console.log("error in getting user profile", err)
        res.status(500).json({message:"error in getting user profile"})
    }
}