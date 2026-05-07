import { RepositoryModel } from "../../models/RepositoryModel.js"

export const createRepoController = async (req, res) => {
    try {
        // get repository data from req body
        const newrepo = req.body
        
        // add owner from token to repository data
        newrepo.owner = req.user?.id

        // check if user id is present in token
        if (!newrepo.owner) {
            return res.status(400).json({ message: "User ID not found in request" })
        }
        
        // console.log("creating repository with data", newrepo)

        // create new repository document and save to db
        const newrepodocument = new RepositoryModel(newrepo)
        const result = await newrepodocument.save()
        
        // console.log("repository created successfully", result)
        
        // send response
        res.status(200).json({ message: "Repository created", payload: newrepo, success: true })
    } catch (err) {
        console.log("Error in creating repository", err)
        res.status(500).json({ message: "Error in creating repository", success: false })
    }
}