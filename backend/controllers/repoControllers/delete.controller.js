import { RepositoryModel } from "../../models/RepositoryModel.js"
import { createNotification } from "../../services/notificationServices/create.service.js"
import { deleteBranch } from "../../services/branchServices/delete.service.js"
import { deleteFile } from "../../services/fileServices/delete.service.js"
import { FileModel } from "../../models/FileModel.js"
import { BranchModel } from "../../models/BranchModel.js"

export const deleteRepoByIdController = async (req, res) => {
    try {
        // get user id from token and repository id from req params
        const uid = req.user?.id || req.user?._id
        const rid = req.params.id
        // check if user id is present in token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request", success: false })
        }

        // check role using checkRepoAccess middleware
        const role = req.role;
        console.log("User role in repository: ", role);
        // if role is not owner, then the user does not have permission to delete the repository
        if (role !== 'owner') {
            return res.status(403).json({
                message: `${role}(s) do not have permission to delete this repository`,
                success: false
            })
        }
        // delete all files from repo
        const files = await FileModel.find({ repository: rid })
        files.forEach(async (file) => {
            await deleteFile({ fileId: file._id })
        })
        // delete all branches from repo
        const branches = await BranchModel.find({ repository: rid })
        branches.forEach(async (branch) => {
            await deleteBranch({ branchId: branch._id })
        })

        // find repository by id
        const deletedRepository = await RepositoryModel.findByIdAndDelete(rid)
        if (!deletedRepository) {
            return res.status(404).json({ message: "Cannot fetch and delete repository", success: false })
        }

        // send notification to user
        await createNotification({
            user: uid,
            type: "REPOSITORY_DELETED",
            reference_id: rid,
            reference_type: "REPOSITORY"
        });

        res.status(200).json({ message: "Repository deleted", success: true })
    } catch (err) {
        console.log("Error in deleting repository", err)
        res.status(500).json({ message: "Error in deleting repository", success: false })
    }
}