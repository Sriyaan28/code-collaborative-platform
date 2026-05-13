import { FileModel } from "../../models/FileModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

export const editFileController = async (req, res) => {
    try {
        const uid = req.user.id;
        const { name, content, fileId, repoId } = req.body;

        // get repo access role from middleware
        const role = req.role;

        // if user is a viewer, they cannot edit the file
        if (role === 'viewer') {
            return res.status(403).json({ message: 'You do not have permission to edit files in this repository', success: false });
        }

        // if user is an owner or collaborator, they can edit the file
        const file = await FileModel.findById(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found', success: false });
        }
        if (file.isDeleted) {
            return res.status(404).json({ message: 'File not found', success: false });
        }
        // update file name and content
        if (name && name !== file.name) {
            file.name = name;
        }
        // update old_content and content if content is changed
        if (content && content !== file.content) {
            file.old_content = file.content || "";
            file.content = content;
        }
        await file.save();

        // send notification to user who edited the file
        // if role is collaborator, send notification to collaborator and owner
        if (role === "collaborator") {
            await createNotification({
                user: uid,
                type: "FILE_UPDATED",
                reference_id: fileId,
                reference_type: "FILE"
            });
            // send notification to owner
            const repo = await RepositoryModel.findById(repoId);
            if (repo?.owner !== uid) {
                await createNotification({
                    user: repo?.owner,
                    type: "FILE_UPDATED",
                    reference_id: fileId,
                    reference_type: "FILE"
                });
            }
        }
        // if role is owner, send notification only to owner
        else if (role === "owner") {
            await createNotification({
                user: uid,
                type: "FILE_UPDATED",
                reference_id: fileId,
                reference_type: "FILE"
            });
        }

        res.status(200).json({ message: 'File updated successfully', payload: file, success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
}

