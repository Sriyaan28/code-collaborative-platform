import { DiscussionModel } from "../../models/DiscussionModel.js";

export const createDiscussionController = async (req, res) => {
    try {
        const { title, content, tags, mentionedUsers, linkedRepositories } = req.body;
        const authorId = req.user.id;

        if (!title || !content) {
            return res.status(400).send({ message: "Title and content are required" });
        }

        const newDiscussion = new DiscussionModel({
            title,
            content,
            author: authorId,
            tags: tags || [],
            mentionedUsers: mentionedUsers || [],
            linkedRepositories: linkedRepositories || []
        });

        await newDiscussion.save();

        return res.status(201).send({
            message: "Discussion published successfully",
            payload: newDiscussion
        });
    } catch (err) {
        console.log("Error in createDiscussionController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
