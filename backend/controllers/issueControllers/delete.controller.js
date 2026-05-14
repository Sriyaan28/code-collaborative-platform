import { deleteIssueByIdService } from "../../services/issueServices/delete.service.js";
import { IssuesModel } from "../../models/IssuesModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

export const deleteIssueController = async (req, res) => {
    try {
        const uid = req.user.id
        const { issueId } = req.params;

        if (!uid || !issueId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        // check if user is owner
        const issue = await IssuesModel.findById(issueId);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            })
        }
        const repoId = issue.repository;
        const repo = await RepositoryModel.findById(repoId);
        const owner = repo.owner;
        if (uid !== owner) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this issue"
            })
        }

        const result = await deleteIssueByIdService(issueId);

        return res.status(result.success ? 200 : 400).json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete issue"
        })
    }
}