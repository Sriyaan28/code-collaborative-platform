import { NotificationModel } from '../../models/NotificationModel.js'

export const getNotificationsController = async (req, res) => {
    try {
        // Get user ID from the request token
        const uid = req.user?.id || req.user?._id

        // Check if user ID is available in the request token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" })
        }

        // Fetch all notifications for the user (seen and unseen)
        const allNotifications = await NotificationModel.find({ user: uid }).sort({ createdAt: -1 })

        // if no notifications are there
        if (allNotifications.length === 0) {
            return res.status(200).json({ message: "No notifications found", payload: { allNotifications: [], seenNotifications: [], unseenNotifications: [] } })
        }

        // filter for seen notifications
        const seenNotifications = allNotifications.filter(notification => notification.isSeen)
        // filter for unseen notifications
        const unseenNotifications = allNotifications.filter(notification => !notification.isSeen)

        // Return the notifications to the client
        res.status(200).json({ message: "notifications fetched successfully", payload: { allNotifications, seenNotifications, unseenNotifications } })
    }
    catch (err) {
        console.log("error in getting notifications", err)
        res.status(500).json({ message: "error in getting notifications" })
    }
}

export const getNotificationByIdController = async (req, res) => {
    try {
        const uid = req.user?.id || req.user?._id
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" })
        }

        const { notificationId } = req.params
        const notification = await NotificationModel.findById(notificationId)
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" })
        }

        // check if notification belongs to the user
        if (notification.user.toString() !== uid.toString()) {
            return res.status(403).json({ message: "Unauthorized" })
        }

        // if Notification is unread, mark it as read
        if (!notification.isSeen) {
            notification.isSeen = true
            await notification.save()
        }

        res.status(200).json({ message: "Notification fetched successfully", payload: notification })
    }
    catch (err) {
        console.log("error in getting notification", err)
        res.status(500).json({ message: "error in getting notification" })
    }
}