import { RepositoryModel } from "../../models/RepositoryModel.js"
import { CollaboratorModel } from "../../models/CollaboratorModel.js"

export const getRepoByIdController = async (req, res) => {
    try {
        const uid = req.user?.id || req.user?._id

        if (!uid) {
            return res.status(400).json({
                message: "User ID not found"
            })
        }

        const rid = req.params.id

        // fetch repository first
        const repository = await RepositoryModel.findById(rid)

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found"
            })
        }

        // everyone can access public repos
        if (repository.visibility === "PUBLIC") {
            return res.status(200).json({
                message: "Repository found",
                payload: repository
            })
        }

        // owner can access private repo
        if (repository.owner.toString() === uid.toString()) {
            return res.status(200).json({
                message: "Repository found",
                payload: repository
            })
        }

        // collaborator can access private repo
        const isCollaborator = await CollaboratorModel.findOne({
            repo: rid,
            user: uid
        })

        if (isCollaborator) {
            return res.status(200).json({
                message: "Repository found",
                payload: repository
            })
        }

        // otherwise deny access
        return res.status(403).json({
            message: "Access denied"
        })

    } catch (err) {
        console.log("Error in getting repository", err)

        res.status(500).json({
            message: "Error in getting repository"
        })
    }
}