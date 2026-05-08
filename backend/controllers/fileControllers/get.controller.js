import { FileModel } from "../../models/FileModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { CollaboratorModel } from "../../models/CollaboratorModel.js";

export const getFileController = async (req, res) => {

    try {

        const fileId = req.params.id;

        const userId = req.user.id;

        // find file
        const file = await FileModel.findById(fileId)
            .populate("createdBy", "name email")
            .populate("repository", "name visibility owner");

        if (!file) {
            return res.status(404).json({
                message: "File not found"
            });
        }

        // repository from file
        const repository = file.repository;

        // PRIVATE repo access check
        if (repository.visibility === "PRIVATE") {

            const isOwner =
                repository.owner.toString() === userId;

            const isCollaborator =
                await CollaboratorModel.findOne({
                    repo: repository._id,
                    user: userId
                });

            if (!isOwner && !isCollaborator) {
                return res.status(403).json({
                    message: "Access denied"
                });
            }
        }

        // success response
        res.status(200).json({
            message: "File fetched successfully",
            file
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch file",
            error: err.message
        });

    }

};