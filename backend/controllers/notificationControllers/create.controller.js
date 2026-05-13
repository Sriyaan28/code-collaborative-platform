import { createNotification } from "../../services/notificationServices/create.service.js";

export const createNotificationController = async (req, res) => {

    try {

        const uid = req.user?.id || req.user?._id;

        if (!uid) {
            return res.status(400).json({
                message: "User not found in request"
            });
        }

        const {
            type,
            reference_id,
            reference_type
        } = req.body;

        const result = await createNotification({
            user: uid,
            type,
            reference_id,
            reference_type
        });

        return res.status(201).json({
            success: true,
            message: "Notification created",
            data: result
        });

    }
    catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};