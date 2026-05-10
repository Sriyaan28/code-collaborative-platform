import { FileModel } from "../../models/FileModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { CollaboratorModel } from "../../models/CollaboratorModel.js";

export const getAllFilesController = async (req, res) => {

    try {

        const  repoId = req.params.repoId;

        const userId = req.user.id;

        // check if repository exists
        const repository = await RepositoryModel.findById(repoId);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
                success: false
            });
        }
        // get role of user from checkRepoAccess middleware
        const role = req.role;

        // if user is blocked, return error
        if (role === "blocked") {
            return res.status(403).json({
                message: "You are blocked from accessing this repository, Please contact Dhairya for more information",
                success: false
            });
        }

        // if role is viewer and repository visibility is private, return error
        if (role === "viewer" && repository.visibility === "PRIVATE") {
            return res.status(403).json({
                message: `${role}(s) cannot access private repositories`,
                success: false
            });
        }
        

        // fetch files
        const files = await FileModel.find({
            repository: repoId
        })
        .select("-content")
        .populate("createdBy", "name email");

        res.status(200).json({
            message: "Files fetched successfully",
            payload: files,
            success: true
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch files",
            error: err.message,
        });

    }

};