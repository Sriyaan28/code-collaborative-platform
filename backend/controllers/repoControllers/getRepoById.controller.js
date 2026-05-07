import { RepositoryModel } from "../../models/RepositoryModel.js"
import { CollaboratorModel } from "../../models/CollaboratorModel.js"

export const getRepoByIdController = async (req, res) => {
    try {
        const uid = req.user?.id || req.user?._id

        if (!uid) {
            return res.status(400).json({
                message: "User ID not found", 
                success: false
            })
        }

        const rid = req.params.id

        // fetch repository first
        const repository = await RepositoryModel.findById(rid)
        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
                success: false
            })
        }

        const role = req.role;
        console.log("User role in repository: ", role);

        // everyone can access public repos
        if (role === 'viewer' && repository.visibility === 'PUBLIC') 
        {
            return res.status(200).json({
                message: "Repository found",
                payload: repository,
                success: true
            })
        }

        // owner can access private repo
        if (role === 'owner') {
            return res.status(200).json({
                message: "Repository found",
                payload: repository,
                success: true
            })
        }

        if (role === 'collaborator') {
            return res.status(200).json({
                message: "Repository found",
                payload: repository,
                success: true
            })
        }

        // otherwise deny access
        return res.status(403).json({
            message: "Access denied",
            success: false
        })

    } catch (err) {
        // console.log("Error in getting repository", err)

        res.status(500).json({
            message: "Error in getting repository",
            success: false
        })
    }
}