import { createFile } from "../../services/fileServices/create.service.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

export const createFileController = async (req, res) => {

    try {

        const uid = req.user?.id || req.user?._id;

        if (!uid) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in request"
            });
        }

        const role = req.role;

        console.log("User role in repository:", role);

        // viewers cannot create files
        if (role === "viewer") {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to create a file in this repository"
            });
        }

        const {
            name,
            content,
            repoId,
            branchId
        } = req.body;

        const newFile = await createFile({
            name,
            content,
            repoId,
            branchId,
            createdBy: uid
        });

        // send a notification to the user who created the file
        await createNotification({
            user: uid,
            type: "FILE_CREATED",
            reference_id: newFile._id,
            reference_type: "FILE"
        });

        return res.status(201).json({
            success: true,
            message: "File created successfully",
            payload: newFile
        });

    }
    catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};