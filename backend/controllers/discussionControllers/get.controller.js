import { DiscussionModel } from "../../models/DiscussionModel.js";

// Get all discussions (with optional search/filter)
export const getAllDiscussionsController = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            };
        }

        const discussions = await DiscussionModel.find(query)
            .populate("author", "name email userProfile")
            .populate("linkedRepositories", "name owner description visibility")
            .populate("mentionedUsers", "name userProfile")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            message: "Discussions fetched successfully",
            payload: discussions
        });
    } catch (err) {
        console.log("Error in getAllDiscussionsController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

// Get single discussion
export const getDiscussionByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        const discussion = await DiscussionModel.findById(id)
            .populate("author", "name email userProfile")
            .populate("linkedRepositories", "name owner description visibility")
            .populate("mentionedUsers", "name userProfile")
            .populate("comments.user", "name email userProfile");

        if (!discussion) {
            return res.status(404).send({ message: "Discussion not found" });
        }

        return res.status(200).send({
            message: "Discussion fetched successfully",
            payload: discussion
        });
    } catch (err) {
        console.log("Error in getDiscussionByIdController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
