import { getIssueService, getAllIssuesService } from "../../services/issueServices/get.service.js";

export const getIssueController = async (req, res) => {
    try {
        const uid = req.user.id
        const issue = await getIssueService(req.params.issueId);
        // if uid is not present in issue.assignees or issue.createdBy(then send error)
        if (!issue.assignees.includes(uid) && issue.createdBy !== uid) {
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