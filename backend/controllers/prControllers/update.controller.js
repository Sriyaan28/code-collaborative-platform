import { PRModel } from "../../models/PRModel.js";

// update PR status using prId
export const updatePRStatusController = async (req, res) => {
    try {
        // get uid
        const uid = req.user.uid

        // get prId from params
        const { prId } = req.params

        // get status from request
        const { status } = req.body

        // validate status
        const allowedStatus = ["opened", "closed", "merged"]
        if (!status || !allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                success: false
            })
        }

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
                message: "You don't have access to update this pull request",
                success: false
            })
        }

        if (!pullRequest) {
            return res.status(404).json({
                message: "Pull request not found",
                success: false
            })
        }

        // check if provided status and existing status is same
        if (pullRequest.status === status) {
            return res.status(400).json({
                message: "Pull request is already in the same state",
                success: false
            })
        }

        // update status

        // if pull request is to be merged then 
        if (status === "merged") {
            // check if pull request is not closed
            if (pullRequest.status === "closed") {
                return res.status(400).json({
                    message: "Pull request is closed",
                    success: false
                })
            }

            // merge pull request
            pullRequest.status = status
            pullRequest.mergedBy = uid
            pullRequest.mergedAt = Date.now()
            await pullRequest.save()

            // control flow for merge in frontend

            return res.status(200).json({
                message: `Pull request merged successfully from ${pullRequest.sourceBranch?.name} to ${pullRequest.targetBranch?.name}`,
                success: true,
                payload: pullRequest
            })
        }

        // if pull request is to be closed then
        if (status === "closed") {
            // check if pull request is not merged
            if (pullRequest.status === "merged") {
                return res.status(400).json({
                    message: "Pull request is already merged",
                    success: false
                })
            }

            // close pull request
            pullRequest.status = status
            pullRequest.closedAt = Date.now()
            await pullRequest.save()

            return res.status(200).json({
                message: "Pull request closed successfully",
                success: true,
                payload: pullRequest
            })
        }

        // if pull request is to be opened then
        if (status === "opened") {
            // check if pull request is not merged
            if (pullRequest.status === "merged") {
                return res.status(400).json({
                    message: "Pull request is already merged",
                    success: false
                })
            }

            // open pull request
            pullRequest.status = status
            await pullRequest.save()

            return res.status(200).json({
                message: "Pull request opened successfully",
                success: true,
                payload: pullRequest
            })
        }
    }
    catch (err) {

    }
}
