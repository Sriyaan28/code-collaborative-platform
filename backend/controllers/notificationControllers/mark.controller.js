import { NotificationModel } from "../../models/NotificationModel.js";

export const markAllAsReadController = async (req, res) => {
    try {
        // Get user ID from the request token
        const uid = req.user?.id || req.user?._id;

        // Check if user ID is available in the request token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" });
        }

        // Mark all notifications for the user as read
        const result = await NotificationModel.updateMany({ user: uid }, { $set: { isSeen: true } });

        // Return success response
        res.status(200).json({ message: "All notifications marked as read successfully", payload: result });
    } catch (err) {
        console.log("Error in marking all notifications as read", err);
        res.status(500).json({ message: "Error in marking all notifications as read" });
    }
}