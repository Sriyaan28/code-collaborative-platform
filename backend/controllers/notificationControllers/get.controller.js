import {NotificationModel} from '../../models/NotificationModel.js'

export const getNotificationsController = async (req,res)=>{
    try{
        // Get user ID from the request token
        const uid=req.user?.id || req.user?._id
        
        // Check if user ID is available in the request token
        if(!uid){
            return res.status(400).json({message:"User ID not found in request"})
        }

        // Fetch all notifications for the user
        const notifications=await NotificationModel.find({user:uid}).sort({createdAt:-1})
        
        // Return the notifications to the client
        res.status(200).json({message:"notifications fetched successfully",payload:notifications})
    }
    catch(err){
        console.log("error in getting notifications",err)
        res.status(500).json({message:"error in getting notifications"})
    }
}