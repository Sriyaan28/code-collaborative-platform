import { PRModel } from "../../models/PRModel.js";

// delete PR by PR id
export const deletePRByIdService = async ({ prId }) => {
    try {
        // check if PR exists
        const pr = await PRModel.findById(prId);
        if (!pr) {
            return { message: "PR not found", success: false }
        }
        // delete PR
        const deletedPR = await PRModel.findByIdAndDelete(prId)
        if (!deletedPR) {
            return { message: "Failed to delete PR", success: false }
        }
        return { message: "PR deleted successfully", success: true }
    } catch (err) {
        console.log("Error in deleting PR", err)
        return { message: "Error in deleting PR", success: false }
    }
}