import { FileModel } from "../../models/FileModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { BranchModel } from "../../models/BranchModel.js";

// get all files from all branches
export const getAllFilesController = async (req, res) => {

    try {

        const repoId = req.params.repoId;

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

        // if user is blocked, return error (already handled in checkRepoAccess middleware)

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
            .populate("createdBy", "_id name email");

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


// get all files from main branch using repoId
export const getAllMainBranchFilesController = async (req, res) => {

    try {

        const repoId = req.params?.repoId;

        if (!repoId) {
            return res.status(400).json({
                message: "Repository ID is required",
                success: false
            })
        }

        // check repository
        const repository = await RepositoryModel.findById(repoId);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
                success: false
            });
        }

        const role = req.role;

        // private repo access check
        if (role === "viewer" && repository.visibility === "PRIVATE") {
            return res.status(403).json({
                message: `${role}(s) cannot access private repositories`,
                success: false
            });
        }

        // get main branch
        const mainBranch = await BranchModel.findOne({
            repository: repoId,
            name: "main"
        });

        // branch not found
        if (!mainBranch) {
            return res.status(404).json({
                message: "Main branch not found",
                success: false
            });
        }

        // fetch files
        const files = await FileModel.find({
            repository: repoId,
            branch: mainBranch._id
        }).select("-content")
            .populate(
                "createdBy",
                "_id name email"
            );

        res.status(200).json({
            message: "Files fetched successfully",
            payload: files,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch files",
            error: error.message,
            success: false
        });
    }
};

// get all files from a branch using repoId and branchId
export const getAllBranchFilesController = async (req, res) => {
    try {
        const repoId = req.params?.repoId;
        const branchId = req.params?.branchId;

        if (!repoId || !branchId) {
            return res.status(400).json({
                message: "Repository ID and Branch ID are required",
                success: false
            })
        }

        // check repository
        const repository = await RepositoryModel.findById(repoId);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
                success: false
            });
        }

        const role = req.role;

        // private repo access check
        if (role === "viewer" && repository.visibility === "PRIVATE") {
            return res.status(403).json({
                message: `${role}(s) cannot access private repositories`,
                success: false
            });
        }

        // fetch files
        const files = await FileModel.find({
            repository: repoId,
            branch: branchId
        }).select("-content")
            .populate(
                "createdBy",
                "_id name email"
            );

        res.status(200).json({
            message: "Files fetched successfully",
            payload: files,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch files",
            error: error.message,
            success: false
        });
    }
};