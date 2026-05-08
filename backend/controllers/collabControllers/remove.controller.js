import { CollaboratorModel } from "../../models/CollaboratorModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

export const removeCollaboratorController = async (req, res) => {
    try {

        // DELETE /repos/:id/collaborators/:userId
        const repoId = req.params?.id;
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