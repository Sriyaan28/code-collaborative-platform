import { RepositoryModel } from "../../models/RepositoryModel.js"

export const deleteRepoByIdController = async (req, res) => {
    try {
        // get user id from token and repository id from req params
        const uid = req.user?.id || req.user?._id
        const rid = req.params.id
        // check if user id is present in token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" })
        }
        
        // check if user is owner of the repository
        const repository = await RepositoryModel.findById(rid)
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" })
        }
        if (repository.owner.toString() !== uid) {
            return res.status(403).json({ message: "You are not the owner of this repository" })
        }

        // find repository by id
        const deletedRepository = await RepositoryModel.findByIdAndDelete(rid)
        if (!deletedRepository) {
            return res.status(404).json({ message: "Cannot fetch and delete repository" })
        }

        res.status(200).json({ message: "Repository deleted" })
    } catch (err) {
        console.log("Error in deleting repository", err)
        res.status(500).json({ message: "Error in deleting repository" })
    }
}