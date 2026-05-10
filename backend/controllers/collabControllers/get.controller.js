import { CollaboratorModel } from "../../models/CollaboratorModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

export const getCollaboratorByIdController = async(req,res)=>{
    try
    {

        
        // get collaborator id from params
        const collabId = req.params?.collabId;

        // find the collaborator
        const collaborator = await CollaboratorModel.findById(collabId);
        if (!collaborator) {
            return res.status(404).json({
                success: false,
                message: "Collaborator not found"
            });
        }

        const repoId = collaborator.repo

        // check if loggedIn user from token is same as the owner of the repo by getting repo details from repo id in collab model
        const repository = await RepositoryModel.findById(repoId);
        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found in collaborator"
            });
        }

        // only owner can check collaborator details
        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view collaborator details"
            });
        }

        // send res if owner
        return res.status(200).json({
            success: true,
            message: "Collaborator details fetched successfully",
            payload: collaborator
        });
    }
    catch(err)
    {
        return res.status(500).json({message:"Failed to fetch collaborator details",success:false})
    }
}