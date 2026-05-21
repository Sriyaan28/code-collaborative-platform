import { IssuesModel } from "../../models/IssuesModel.js";

export const getIssueService = async (issueId) => {
    try {
        const issue = await IssuesModel.findById(issueId)
            .populate("createdBy", "_id name email userProfile")
            .populate("assignees", "_id name email userProfile")
            .populate("repository", "_id name visibility owner");
        if (!issue) {
            throw new Error("Issue not found");
        }
        return issue;
    } catch (error) {
        throw error;
    }
}

export const getAllIssuesService = async (repoId) => {
    try {
        const issues = await IssuesModel.find({ repository: repoId })
            .populate("createdBy", "_id name email userProfile")
            .populate("assignees", "_id name email userProfile");
        return issues;
    } catch (error) {
        throw error;
    }
}