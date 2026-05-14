import { CollaboratorModel } from "../../models/CollaboratorModel.js";

// delete collab by id
export const deleteCollabByIdService = async ({ collabId }) => {
    try {
        const deletedComment = await CollaboratorModel.findByIdAndDelete(collabId);
    }
    catch (err) {
        throw err;
    }
}
