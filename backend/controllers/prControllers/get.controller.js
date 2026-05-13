import { PRModel } from "../../models/PRModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

// get all pull requests from a repo using repoId from params
export const getAllPullRequestController = async (req, res) => {
    try {
        // get uid
        const uid = req.user.uid

        // get role
        const role = req.role

        // get repoId from params
        const { repoId } = req.params

        if (!repoId) {
            return res.status(400).json({
                message: "Repository ID not found",
                success: false
            })
        }

        // if role is not owner, return error
        if (role !== "owner") {
            return res.status(403).json({
                message: "You don't have access to get pull requests",
                success: false
            })
        }

        // get all pull requests
        const pullRequests = await PRModel.find({ repository: repoId })
            .populate("createdBy", "_id name userProfile")
            .populate("sourceBranch", "_id name")
            .populate("targetBranch", "_id name");

        // sort by status
        const openPullRequests = pullRequests.filter(pr => pr.status === "opened")
        const closedPullRequests = pullRequests.filter(pr => pr.status === "closed")
        const mergedPullRequests = pullRequests.filter(pr => pr.status === "merged")

        return res.status(200).json({
            message: "Pull requests fetched successfully",
            success: true,
            payload: {
                openPullRequests,
                closedPullRequests,
                mergedPullRequests
            }
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Pull request fetch failed",
            success: false,
            error: err.message
        })
    }
}


// get a pull request using prId from params
// only owners can access whole details of a PR using prId
export const getPullRequestController = async (req, res) => {
    try {
        // get uid
        const uid = req.user.uid


        // get prId from params
        const { prId } = req.params

        if (!prId) {
            return res.status(400).json({
                message: "Pull request ID not found",
                success: false
            })
        }


        // get the pull request
        const pullRequest = await PRModel.findById(prId)
            .populate("createdBy", "_id name email userProfile")
            .populate("sourceBranch", "_id name")
            .populate("targetBranch", "_id name")
            .populate("mergedBy", "_id name email userProfile")
            .populate("repository", "_id name visibility owner");

        // only owner can access whole details of a PR
        if (pullRequest.repository?.owner?.id !== uid) {
            return res.status(403).json({
                message: "You don't have access to get full details of this pull request",
                success: false
            })
        }

        if (!pullRequest) {
            return res.status(404).json({
                message: "Pull request not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Pull request fetched successfully",
            success: true,
            payload: pullRequest
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Pull request fetch failed",
            success: false,
            error: err.message
        })
    }
}