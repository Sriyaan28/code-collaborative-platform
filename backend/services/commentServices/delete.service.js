import { CommentModel } from "../../models/CommentModel.js";

// delete comment by id
export const deleteCommentByIdService = async ({ commentId }) => {
    try {
        const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    }
    catch (err) {
        throw err;
    }
}