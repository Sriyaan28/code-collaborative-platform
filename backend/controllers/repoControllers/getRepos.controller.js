import { RepositoryModel } from '../../models/RepositoryModel.js'
import {CollaboratorModel} from '../../models/CollaboratorModel.js'

// controller for getting all repositories (displays all repositories in the platform where the visibility is public)
export const getAllReposController = async (req, res) => {
    try 
    {
        const uid = req.user?.id || req.user?._id
        if (!uid) {
            return res.status(400).json({ message: "User ID not found in request" })
        }

        // find all repositories in the database where visibility is public
        const repositories = await RepositoryModel.find({ visibility: "PUBLIC", owner: { $ne: uid } })
        .select("_id name description visibility owner").sort({ createdAt: -1 })

        // user owned repositories should be displayed separately with private repositories
        const userRepos = await RepositoryModel.find({ owner: uid })
        .select("_id name description visibility owner").sort({ createdAt: -1 })

        // user collaborated repositories which are private should also be displayed in user repositories section
        const collaboratedReposIds = await CollaboratorModel.find({ user: uid }).select("repo")
        const collaboratedRepos = await RepositoryModel.find({ _id: { $in: collaboratedReposIds.map(c => c.repo) }, visibility: "PRIVATE" })
        userRepos.push(...collaboratedRepos)

        // return the repositories to the client
        res.status(200).json({ message: "Repositories found", payload: { publicRepositories: repositories, userRepositories: userRepos } })
    } 
    catch (err) {
        console.log("Error in getting repositories", err)
        res.status(500).json({ message: "Error in getting repositories" })
    }
}