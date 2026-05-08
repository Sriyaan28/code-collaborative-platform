import { CollaboratorModel } from "../../models/CollaboratorModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { UserModel } from "../../models/UserModel.js";

export const getCollaboratorsController = async (req, res) => {

    try {

        const repoId = req.params.id;

        // Check if the repository exists
        const repository = await RepositoryModel.findById(repoId);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }
        // fetch role from checkRepoAccess middleware
        const role = req.role;

        // Only owners can view collaborators
        if (role !== "owner") {
            return res.status(403).json({
                message: "Access denied. Only owners can view collaborators."
            });
        }
        // Fetch collaborators of the repository
        const collaborators = await CollaboratorModel
            .find({ repo: repoId, role: "collaborator" })
            .populate("user", "_id name email");

        const blockedUsers = await CollaboratorModel
            .find({ repo: repoId, role: "blocked" })
            .populate("user", "_id name email");
        
        res.status(200).json({
            message: "Collaborators and Blocked Users fetched successfully",
            payload: {
                collaborators: collaborators,
                blockedUsers: blockedUsers
            }
        });
            
    } catch (err) {

        res.status(500).json({
            message: "Failed to fetch collaborators",
            error: err.message
        });

    }

};