import { CollaboratorModel } from "../../models/CollaboratorModel.js";

export const updateCollabController = async (req, res) => {
    try {

        // get collab id from params
        const collabId = req.params.id;

        // get new role from body
        const { role: newRole } = req.body;

        // get logged in user's role from checkRepoAccess middleware
        const role = req.role;

        if (role !== "owner") {
            return res.status(403).json({
                message: "You do not have permission to update this collaborator",
                success: false
            });
        }

        const updatedCollab = await CollaboratorModel.findOneAndUpdate(
            {
                _id: collabId,
                repo: req.repository._id
            },
            {
                role: newRole
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCollab) {
            return res.status(404).json({
                message: "Collaborator not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Collaborator updated successfully",
            payload: updatedCollab,
            success: true
        });

    }
    catch (err) {

        res.status(500).json({
            message: "Error updating collaborator",
            error: err.message,
            success: false
        });

    }
};