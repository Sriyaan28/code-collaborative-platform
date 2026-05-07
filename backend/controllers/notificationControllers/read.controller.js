import { NotificationModel } from "../../models/NotificationModel.js"

export const readNotificationsController = async (req,res)=>{
    try{
        // Get user ID from the request token
        const uid=req.user?.id || req.user?._id
        
        // Check if user ID is available in the request token
        if(!uid){
            return res.status(400).json({message:"User ID not found in request"})
        }
        // Fetch all notifications for the user
        const notifications=await NotificationModel.find({user:uid}).sort({createdAt:-1})
        
        // Mark all unread notifications as read
        const unreadNotifications=notifications.filter(notif=>!notif.read)
        
        // Mapping to get only the IDs of unread notifications
        const unreadIds=unreadNotifications.map(notif=>notif._id)
        
        // Update all unread notifications to read
        await NotificationModel.updateMany({_id:{$in:unreadIds}},{$set:{read:true}})
        
        // Fetch the updated notifications after marking as read
        const updatedNotifications=await NotificationModel.find({user:uid}).sort({createdAt:-1})
        
        // Return the updated notifications to the client
        res.status(200).json({message:"notifications marked as read successfully",payload:updatedNotifications})
    }
    catch(err){
        console.log("error in getting notifications",err)
        res.status(500).json({message:"error in getting notifications"})
    }
}