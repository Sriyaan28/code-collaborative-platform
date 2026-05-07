import { RepositoryModel } from "../../models/RepositoryModel.js";

// controller for searching repositories by name(uses regex for partial and case-insensitive matching)
export const searchRepoByNameController = async (req, res) => {
    try {
        // get search query from req query
        const { query } = req.query;

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
            visibility: "public"
        }).sort({ createdAt: -1 })
            .select("_id name description visibility owner")
            .limit(10);

        // if user is owner, they can see their private repositories in search results as well
        if (req.user) {
            const uid = req.user?.id || req.user?._id
            const privateRepos = await RepositoryModel.find({
                name: {
                    $regex: query,
                    $options: "i"
                },
                owner: uid,
                visibility: "private"
            }).sort({ createdAt: -1 })
                .select("_id name description visibility owner")
                .limit(10);

            // add private repos to repositories array if private repos exist
            if (privateRepos && privateRepos.length > 0) {
                repositories.push(...privateRepos);
            }
        }

        // return the repositories to the client
        return res.status(200).json({
            success: true,
            message: "Repositories fetched successfully",
            payload: repositories

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};