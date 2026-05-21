import { DiscussionModel } from "../../models/DiscussionModel.js";

// Toggle Like
export const toggleLikeDiscussionController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const discussion = await DiscussionModel.findById(id);
        if (!discussion) {
            return res.status(404).send({ message: "Discussion not found" });
        }

        const likeIndex = discussion.likes.indexOf(userId);
        let message = "";

        if (likeIndex === -1) {
            // Like
            discussion.likes.push(userId);
            message = "Discussion liked";
        } else {
            // Unlike
            discussion.likes.splice(likeIndex, 1);
            message = "Discussion unliked";
        }

        await discussion.save();

        return res.status(200).send({
            message,
            payload: discussion.likes
        });
    } catch (err) {
        console.log("Error in toggleLikeDiscussionController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

// Add Comment
export const addCommentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).send({ message: "Comment content is required" });
        }

        const discussion = await DiscussionModel.findById(id);
        if (!discussion) {
            return res.status(404).send({ message: "Discussion not found" });
        }

        discussion.comments.push({
            user: userId,
            content
        });

        await discussion.save();

        // return the updated discussion with populated comments
        const updatedDiscussion = await DiscussionModel.findById(id)
            .populate("author", "name email userProfile")
            .populate("comments.user", "name email userProfile");

        return res.status(201).send({
            message: "Comment added successfully",
            payload: updatedDiscussion.comments
        });
    } catch (err) {
        console.log("Error in addCommentController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

// Delete Comment
export const deleteCommentController = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const userId = req.user.id;

        const discussion = await DiscussionModel.findById(id);
        if (!discussion) {
            return res.status(404).send({ message: "Discussion not found" });
        }

        const commentIndex = discussion.comments.findIndex(c => c._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).send({ message: "Comment not found" });
        }

        const comment = discussion.comments[commentIndex];

        // Check if user is authorized to delete the comment
        // Authorized if user is the comment author OR user is the discussion author
        if (comment.user.toString() !== userId && discussion.author.toString() !== userId) {
            return res.status(403).send({ message: "Not authorized to delete this comment" });
        }

        discussion.comments.splice(commentIndex, 1);
        await discussion.save();

        const updatedDiscussion = await DiscussionModel.findById(id)
            .populate("author", "name email userProfile")
            .populate("comments.user", "name email userProfile");

        return res.status(200).send({
            message: "Comment deleted successfully",
            payload: updatedDiscussion.comments
        });
    } catch (err) {
        console.log("Error in deleteCommentController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
