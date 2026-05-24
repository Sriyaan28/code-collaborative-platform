import { RepositoryModel } from "../../models/RepositoryModel.js"
import { createNotification } from "../../services/notificationServices/create.service.js";

export const updateRepoByIdController = async (req, res) => {
    try {

        // get user id from token and repository id from params
        const uid = req.user?.id || req.user?._id
        const rid = req.body?.repoId

        // check if user id is present in token
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" })
        }
        // check role using checkRepoAccess middleware
        const role = req.role;
        console.log("User role in repository: ", role);
        // if role is not owner, then the user does not have permission to update the repository
        if (role !== 'owner') {
            return res.status(403).json({
                message: `Only the owner can update this repository`,
                success: false
            })
        }

        // find repository by id
        const repository = await RepositoryModel.findById(rid)
        if (!repository) {
            return res.status(404).json({ message: "Repository not found" })
        }

        // check if new name already exists for this owner
        if (req.body.name && req.body.name !== repository.name) {
            const existingRepo = await RepositoryModel.findOne({ owner: uid, name: req.body.name });
            if (existingRepo) {
                return res.status(400).json({ message: `You already have a repository named '${req.body.name}'`, success: false });
            }
        }
        // update repository with new data from req body
        const updatedRepository = await RepositoryModel.findByIdAndUpdate(
            rid,
            { $set: { ...req.body } },
            { returnDocument: 'after', runValidators: true }
        )
        if (!updatedRepository) {
            return res.status(404).json({ message: "Failed to fetch and update repository" })
        }
        // send notification to owner
        if (updatedRepository) {
            await createNotification({
                user: repository.owner,
                type: "REPOSITORY_UPDATED",
                reference_id: rid,
                reference_type: "REPOSITORY"
            });
        }
        res.status(200).json({ message: "Repository updated", payload: updatedRepository, success: true })
    } catch (err) {
        console.log("error in updating repository", err)
        res.status(500).json({ message: "error in updating repository", success: false })
    }
}