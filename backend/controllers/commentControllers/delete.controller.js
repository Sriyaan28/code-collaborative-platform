import { CommentModel } from "../../models/CommentModel.js";
import { deleteCommentByIdService } from "../../services/commentServices/delete.service.js";

// delete comment by id
export const deleteController = async (req, res) => {
    try {
        // get user id from token
        const uid = req.user?.id;
        // get comment id from params
        const { commentId } = req.params;

        // check if comment id is provided
        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        // check if comment exists and user is authorized to delete it
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.user.toString() !== uid) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        // delete comment using delete comment service
        await deleteCommentByIdService({ commentId });
        return res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}