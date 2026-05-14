import { RepositoryModel } from "../../models/RepositoryModel.js";

// delete repository by repoId
export const deleteRepoByIdService = async ({ repoId }) => {
    try {
        // check if repository exists
        const repository = await RepositoryModel.findById(repoId);
        if (!repository) {
            return { message: "Repository not found", success: false }
        }
        // delete repository
        const deletedRepository = await RepositoryModel.findByIdAndDelete(repoId)
        if (!deletedRepository) {
            return { message: "Failed to delete repository", success: false }
        }
        return { message: "Repository deleted successfully", success: true }
    } catch (err) {
        console.log("Error in deleting repository", err)
        return { message: "Error in deleting repository", success: false }
    }
}