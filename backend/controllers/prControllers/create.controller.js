import { PRModel } from "../../models/PRModel.js";
import { BranchModel } from "../../models/BranchModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

export const createPullRequestController = async (req, res) => {
    try {
        // get user from token
        const uid = req.user.id
        // get role from checkRepoAccess middleware 
        const role = req.role

        // get pr details from req
        const { title, description, sourceBranch, targetBranch, repository } = req.body;

        // validate input
        if (!title || !description || !sourceBranch || !targetBranch || !repository) {
            return res.status(400).json({
                message: "Title, description, source branch, target branch and repository are required",
                success: false
            })
        }

        // sourceBranch cannot be main branch
        if (sourceBranch === "main") {
            return res.status(400).json({
                message: "Source branch cannot be main branch",
                success: false
            })
        }

        // check if sourceBranch and targetBranch are same, if same then return error
        if (sourceBranch === targetBranch) {
            return res.status(400).json({
                message: "Source branch and target branch cannot be same",
                success: false
            })
        }

        // check if sourceBranch and targetBranch exists
        const sourceBranchObj = await BranchModel.findById(sourceBranch);
        if (!sourceBranchObj) {
            return res.status(404).json({
                message: "Source branch not found",
                success: false
            })
        }
        const targetBranchObj = await BranchModel.findById(targetBranch);
        if (!targetBranchObj) {
            return res.status(404).json({
                message: "Target branch not found",
                success: false
            })
        }

        // check if branches belongs to same repo
        if (sourceBranchObj.repository?.toString() !== targetBranchObj.repository?.toString()) {
            return res.status(400).json({
                message: "Source branch and target branch must belong to the same repository",
                success: false
            })
        }

        // if role is viewer, return error
        if (role === "viewer") {
            return res.status(403).json({
                message: "Viewer role does not have access to create pull request",
                success: false
            })
        }

        // create a pr and save to db
        const pr = await PRModel.create({
            title,
            description,
            sourceBranch,
            targetBranch,
            repository,
            createdBy: uid
        })

        await pr.save()
        const repo = await RepositoryModel.findById(repository)

        // send notification to repo owner
        await createNotification({
            user: repo.owner,
            type: "PR_CREATED",
            reference_id: pr._id,
            reference_type: "PR"
        })

        return res.status(201).json({
            message: "Pull request created successfully",
            success: true,
            payload: pr
        })

    } catch (err) {
        return res.status(500).json({
            message: "Pull request creation failed",
            success: false,
            error: err.message
        })
    }
}