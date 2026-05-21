import { IssuesModel } from "../../models/IssuesModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

export const updateIssueStatusController = async (req, res) => {
    try {
        const uid = req.user.id;
        const { issueId } = req.params;
        const { status } = req.body;

        if (!status || !['open', 'closed'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                success: false
            });
        }

        const issue = await IssuesModel.findById(issueId);
        if (!issue) {
            return res.status(404).json({
                message: "Issue not found",
                success: false
            });
        }

        // Only owner, creator, or assignee can update status
        const isCreator = issue.createdBy?.toString() === uid;
        const isAssignee = issue.assignees?.some(assignee => assignee.toString() === uid);
        
        const repo = await RepositoryModel.findById(issue.repository);
        const isOwner = repo?.owner?.toString() === uid;

        if (!isCreator && !isAssignee && !isOwner) {
            return res.status(403).json({
                message: "You are not authorized to update this issue",
                success: false
            });
        }

        if (issue.status === status) {
            return res.status(400).json({
                message: `Issue is already ${status}`,
                success: false
            });
        }

        issue.status = status;
        await issue.save();

        // Send notification to creator (if not the one who updated)
        if (!isCreator) {
            await createNotification({
                user: issue.createdBy,
                type: status === "closed" ? "ISSUE_CLOSED" : "ISSUE_REOPENED",
                reference_id: issue._id,
                reference_type: "ISSUE"
            });
        }

        return res.status(200).json({
            message: `Issue ${status} successfully`,
            success: true,
            payload: issue
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to update issue",
            success: false,
            error: err.message
        });
    }
};
