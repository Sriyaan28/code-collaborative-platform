import { getIssueService, getAllIssuesService } from "../../services/issueServices/get.service.js";

export const getIssueController = async (req, res) => {
    try {
        const uid = req.user.id
        const issue = await getIssueService(req.params.issueId);
        const isCreator = issue.createdBy?._id?.toString() === uid || issue.createdBy?.toString() === uid;
        const isAssignee = issue.assignees?.some(assignee => assignee?._id?.toString() === uid || assignee?.toString() === uid);
        const isOwner = issue.repository?.owner?.toString() === uid;

        if (!isCreator && !isAssignee && !isOwner) {
            return res.status(403).json({ message: "User is not authorized to view this issue", success: false });
        }

        res.status(200).json({ message: "Issue fetched successfully", success: true, payload: { issue } });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

export const getAllIssuesController = async (req, res) => {
    try {
        const issues = await getAllIssuesService(req.params.repoId);
        const uid = req.user.id
        const role = req.role
        if (role === "viewer") {
            return res.status(403).json({ message: "User is not authorized to view issues", success: false });
        }
        res.status(200).json({ message: "All issues fetched successfully", success: true, payload: { issues } });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}