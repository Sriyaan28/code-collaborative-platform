import { RepositoryModel } from "../../models/RepositoryModel.js";
import { CollaboratorModel } from "../../models/CollaboratorModel.js";

// controller for searching repositories by name(uses regex for partial and case-insensitive matching)
export const searchRepoByNameController = async (req, res) => {
    try {
        const uid = req.user?.id || req.user?._id

        if (!uid) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in request"
            });
        }
        // get search query from req query
        const query = req.body?.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }


        // search repositories by name using regex for partial and case-insensitive matching (visibility should be public for non owners)
        const repositories = await RepositoryModel.find({
            name: {
                $regex: query,
                $options: "i"
            },
            owner: { $ne: uid },
            visibility: "PUBLIC"
        }).sort({ createdAt: -1 })
            .select("_id name description visibility owner")
            .limit(10);

        // if user is collaborator of any private repository, include those as well in the search results
        const collaboratedReposIds = await CollaboratorModel.find({ user: uid }).select("repo")
        const collaboratedRepos = await RepositoryModel.find({ _id: { $in: collaboratedReposIds.map(c => c.repo) },
         name: { $regex: query,
                 $options: "i" } })
            .select("_id name description visibility owner")
            .limit(10);

        // return the repositories to the client
        return res.status(200).json({
            success: true,
            message: "Repositories fetched successfully",
            payload: [...repositories, ...collaboratedRepos]

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};