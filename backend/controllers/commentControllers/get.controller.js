import { CommentModel } from "../../models/CommentModel.js";

export const getAllCommentsByParentIdController = async (req, res) => {
    try {

        // parentId can be of fileId, prId or issueId
        const { parentId } = req.params;

        // if no parentId is provided
        if (!parentId) {
            return res.status(400).json({ message: "Parent ID is required", success: false });
        }

        // check if comment exists(sort by latest comments first)
        const comments = await CommentModel.find({ parent_id: parentId }).populate("user", "_id name userProfile").sort({ createdAt: -1 });
        if (!comments) {
            return res.status(404).json({ message: "Comments not found", success: false });
        }

        // return comment
        return res.status(200).json({ message: "Comments found", payload: { comments }, success: true });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err, success: false });
    }
}