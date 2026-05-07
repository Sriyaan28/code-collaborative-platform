import { NotificationModel } from "../../models/NotificationModel.js";

export const deleteNotificationController = async (req, res) => {
    try {
        // Get user ID from the request token
        const uid = req.user?.id || req.user?._id;
        
        // Check if user ID is available in the request token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" });
        }

        // Get notification ID from request parameters
        const { id } = req.params;

        // Find and delete the notification that matches the ID and belongs to the user
        const notification = await NotificationModel.findOneAndDelete({ _id: id, user: uid });

        // If no notification is found, return a 404 error
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Return success response with the deleted notification
        res.status(200).json({ message: "Notification deleted successfully", payload: notification });
    } catch (err) {
        console.log("Error in deleting notification", err);
        res.status(500).json({ message: "Error in deleting notification" });
    }
}