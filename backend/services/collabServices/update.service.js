import { CollaboratorModel } from "../../models/CollaboratorModel.js";

// update role of user

export const updateCollabService = async (collaborationId, role) => {

    try {

        const updatedCollab = await CollaboratorModel.findByIdAndUpdate(
            collaborationId,
            { $set: { role } },
            { new: true }
        );

        return updatedCollab;

    } catch (err) {

        console.log("Error in updateCollabService", err);
        throw err;

    }

}
