import { RepositoryModel } from "../../models/RepositoryModel.js"

export const getRepoByIdController = async (req, res) => {
    try {
        const rid = req.params.id
        const repository = await RepositoryModel.findById(rid)
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" })
        }
        res.status(200).json({ message: "Repository found", payload: repository })
    } catch (err) {
        console.log("Error in getting repository", err)
        res.status(500).json({ message: "Error in getting repository" })
    }
}