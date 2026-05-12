import { FileModel } from "../../models/FileModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { CollaboratorModel } from "../../models/CollaboratorModel.js";

export const getFileController = async (req, res) => {

    try {

        const fileId = req.params?.fileId;
        if (!fileId) {
            return res.status(400).json({
                message: "File ID is required",
                success: false
            });
        }

        const userId = req.user?.id;

        // find file
        const file = await FileModel.findById(fileId)
            .populate("createdBy", "_id name email")
            .populate("repository", "_id name visibility owner")
            .populate("branch", "_id name");

        if (!file) {
            return res.status(404).json({
                message: "File not found",
                success: false
            });
        }

        // repository from file
        const repository = file.repository;

        // PRIVATE repo access check
        if (repository.visibility === "PRIVATE") {

            const isOwner = repository.owner.toString() === userId;

            const isCollaborator =
                await CollaboratorModel.findOne({
                    repo: repository._id,
                    user: userId
                });

            if (!isOwner && !isCollaborator) {
                return res.status(403).json({
                    message: "Access denied",
                    success: false
                });
            }
        }

        // success response
        res.status(200).json({
            message: "File fetched successfully",
            payload: { file: file },
            success: true
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch file",
            error: err.message,
            success: false
        });

    }

};