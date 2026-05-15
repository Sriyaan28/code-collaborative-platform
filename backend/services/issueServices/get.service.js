import { IssuesModel } from "../../models/IssueModel.js";

export const getIssueService = async (issueId) => {
    try {
        const issue = await IssuesModel.findById(issueId);
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
        const issues = await IssuesModel.find({ repository: repoId });
        return issues;
    } catch (error) {
        throw error;
    }
}