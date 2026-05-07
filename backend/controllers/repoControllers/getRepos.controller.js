import { RepositoryModel } from '../../models/RepositoryModel.js'

// controller for getting all repositories (displays all repositories in the platform where the visibility is public)
export const getAllReposController = async (req, res) => {
    try 
    {
        // find all repositories in the database where visibility is public
        const repositories = await RepositoryModel.find({ visibility: "public" })
        .select("_id name description visibility owner").sort({ createdAt: -1 })
        
        // return the repositories to the client
        res.status(200).json({ message: "Repositories found", payload: repositories })
    } 
    catch (err) {
        console.log("Error in getting repositories", err)
        res.status(500).json({ message: "Error in getting repositories" })
    }
}