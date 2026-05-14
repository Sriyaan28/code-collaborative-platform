import { FileModel } from "../../models/FileModel.js";
import { deleteFile } from "../../services/fileServices/delete.service.js";
import { createNotification } from "../../services/notificationServices/create.service.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

// temporarily delete file
export const deleteFileToggleController = async (req, res) => {
    try {
        // PUT /api/files/file/:fileId -> soft delete a file by setting isDeleted to true
        // Get fileId from params
        const fileId = req.params.fileId;
        const repoId = req.body.repoId;

        // find file by id and repoId
        const file = await FileModel.findOne({ _id: fileId, repository: repoId });
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        // check if isDeleted status is same as the one in request body, if same then return error
        if (file.isDeleted === req.body.isDeleted) {
            return res.status(400).json({ message: `File is already ${file.isDeleted ? "deleted" : "active"}` });
        }
        // update isDeleted status
        file.isDeleted = req.body.isDeleted;
        await file.save();
        // send notification to owner
        const repo = await RepositoryModel.findById(repoId);
        if (req.body.isDeleted) {
            await createNotification({
                user: repo.owner,
                type: "FILE_DELETED",
                reference_id: fileId,
                reference_type: "FILE"
            })
        } else {
            await createNotification({
                user: repo.owner,
                type: "FILE_RESTORED",
                reference_id: fileId,
                reference_type: "FILE"
            })
        }
        res.status(200).json({ message: `File ${file.isDeleted ? "deleted" : "restored"} successfully`, success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting file", error: err.message, success: false });
    }
}

// permanently delete file using delete file service
export const deleteFileController = async (req, res) => {
    try {

        // get uid
        const uid = req.user.id

        // Get fileId from params
        const fileId = req.params.fileId;

        // fetch repoId and branchId from fileId
        const file = await FileModel.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: "File not found", success: false });
        }

        // check access by getting repo details
        const repo = await RepositoryModel.findById(file.repository);

        if (!repo) {
            return res.status(404).json({ message: "Repository not found", success: false });
        }

        // if repo.owner is not uid, then deny access
        if (repo.owner !== uid) {
            return res.status(403).json({ message: "You do not have permission to delete this file", success: false });
        }

        // delete file permanently
        const deletedFile = await deleteFile({ fileId });

        // set notification to owner 
        await createNotification({
            user: repo.owner,
            type: "FILE_DELETED",
            reference_id: fileId,
            reference_type: "FILE"
        })

        res.status(200).json({ message: "File deleted successfully", payload: deletedFile, success: true });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting file", error: err.message, success: false });
    }
}