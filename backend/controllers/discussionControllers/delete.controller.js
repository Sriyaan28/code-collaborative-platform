import { DiscussionModel } from "../../models/DiscussionModel.js";

export const deleteDiscussionController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const discussion = await DiscussionModel.findById(id);
        if (!discussion) {
            return res.status(404).send({ message: "Discussion not found" });
        }

        if (discussion.author.toString() !== userId) {
            return res.status(403).send({ message: "You are not authorized to delete this discussion" });
        }

        await DiscussionModel.findByIdAndDelete(id);

        return res.status(200).send({
            message: "Discussion deleted successfully"
        });
    } catch (err) {
        console.log("Error in deleteDiscussionController:", err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
