import { IssuesModel } from "../../models/IssuesModel.js";

export const getAssignedIssuesController = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch open issues where the user is in the assignees array
        const issues = await IssuesModel.find({
            assignees: userId,
            status: 'open'
        })
        .populate("repository", "name owner")
        .populate("createdBy", "name email userProfile")
        .populate("assignees", "name email userProfile")
        .sort({ createdAt: -1 });

        return res.status(200).send({
            message: "Assigned issues fetched successfully",
            payload: issues
        });
    } catch (err) {
        console.log("Error in getAssignedIssuesController:", err.message);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
};
