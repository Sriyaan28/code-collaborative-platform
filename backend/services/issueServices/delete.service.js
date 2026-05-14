import { IssuesModel } from "../../models/IssuesModel.js";

// delete issue by id
export const deleteIssueByIdService = async ({ issueId }) => {
    try {
        const deletedIssue = await IssuesModel.findByIdAndDelete(issueId);
    }
    catch (err) {
        throw err;
    }
}