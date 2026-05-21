import { CommitModel } from "../../models/CommitModel.js";

// get all commits by a specific user (for contribution graph)
export const getCommitsByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }

        // Fetch commits where the user is the author
        // We only need createdAt for the contribution graph, but let's grab basic info
        const commits = await CommitModel.find({ author: userId })
            .select("createdAt repository branch message")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "User commits fetched successfully",
            payload: commits,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch user commits",
            error: err.message,
            success: false
        });
    }
};
