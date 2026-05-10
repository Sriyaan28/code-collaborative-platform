import { CollaboratorModel } from "../../models/CollaboratorModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";


// remove using repoId and userId
export const removeCollaboratorController = async (req, res) => {
    try {

        // DELETE /repos/:id/collaborators/:userId
        const repoId = req.params?.repoId;
        const userId = req.params?.userId;

        // logged in user from token
        const uid = req.user.id;

        // find repository
        const repository = await RepositoryModel.findById(repoId);

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }

        // get role from checkRepoAccess middleware
        const role = req.role;
        // only owner can remove collaborators or unblock users
        if (role !== "owner") {
            return res.status(403).json({
                message: "Only owner can remove collaborators"
            });
        }

        // check if userId is a collaborator or blocked
        const collaborator = await CollaboratorModel.findOne({ repo: repoId, user: userId });
        if (!collaborator) {
            return res.status(404).json({
                message: "User is not a collaborator"
            });
        }
        // remove collaborator as collaborator or unblock if blocked
        await CollaboratorModel.findByIdAndDelete(collaborator._id);

        res.status(200).json({
            message: "Collaborator removed successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: "Failed to remove collaborator",
            error: err.message
        });

    }
};


// delete using collabId -> DELETE /collab/:collabId
export const deleteCollaboratorByIdController = async (req, res) => {
    try {
        // get collabId from req params
        const collabId = req.params?.collabId;
        if (!collabId) {
            return res.status(400).json({
                message: "Collaborator ID is required",
                success: false
            });
        }

        // get loggedIn userId
        const uid = req.user?.id;
        if (!uid) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        // get collaborator details
        const collaborator = await CollaboratorModel.findById(collabId);
        if (!collaborator) {
            return res.status(404).json({
                message: "Collaborator not found",
                success: false
            });
        }

        const repoId = collaborator.repo

        // find owner of repository
        const repository = await RepositoryModel.findById(repoId);
        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
                success: false
            });
        }

        // if owner doesnt match loggedIn user
        if (repository.owner.toString() !== uid) {
            return res.status(403).json({
                message: "Only owner can delete collaborators",
                success: false
            });
        }

        // else delete
        await CollaboratorModel.findByIdAndDelete(collabId);

        res.status(200).json({
            message: "Collaborator deleted successfully",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete collaborator",
            error: err.message,
            success: false
        });
    }
}