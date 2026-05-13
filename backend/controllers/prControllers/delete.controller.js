import { PRModel } from "../../models/PRModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

// delete a pull request by prId from params
export const deletePullRequestController = async (req, res) => {
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
                message: "You don't have access to delete this pull request",
                success: false
            })
        }

        if (!pullRequest) {
            return res.status(404).json({
                message: "Pull request not found",
                success: false
            })
        }

        // pr can only be deleted in closed state
        // check if pr is merged or opened
        if (pullRequest.status === "merged") {
            return res.status(400).json({
                message: `Pull request cannot be deleted as it is already merged into ${pullRequest.targetBranch.name}`,
                success: false
            })
        }

        if (pullRequest.status === "opened") {
            return res.status(400).json({
                message: "Pull request cannot be deleted in open state, Please close the pull request to perform deletion",
                success: false
            })
        }

        // send notification to user
        await createNotification({
            user: uid,
            type: "PR_DELETED",
            reference_id: prId,
            reference_type: "PR"
        })

        // delete pull request
        await pullRequest.deleteOne();

        return res.status(200).json({
            message: "Pull request deleted successfully",
            success: true,
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Pull request deletion failed",
            success: false,
            error: err.message
        })
    }
}