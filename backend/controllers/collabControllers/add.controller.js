import { CollaboratorModel } from "../../models/CollaboratorModel.js"
import { RepositoryModel } from "../../models/RepositoryModel.js"
export const addCollabController =async (req,res)=>{
    try{
        const {repoId, role,userId}= req.body
        
        // get logged in user id from token
        const loggedIn= req.user?._id || req.user?.id
        
        // find repository
        const repo= await RepositoryModel.findById(repoId)
        if(!repo){
            return res.status(404).json({message:"Repository not found"})
        }
        // Only owner can add collaborators
        if(repo.owner.toString()!==loggedIn.toString()){
            return res.status(403).json({message:"Only owner can add collaborators"})
        }
        const existingCollab= await CollaboratorModel.findOne({repo:repoId,user:userId})
        if(existingCollab){
            return res.status(400).json({message:"User is already a collaborator"})
        }
        const newCollaborator= new CollaboratorModel({
            repo:repoId,
            role:role|| "viewer",
            user: userId
        })
        const result=await newCollaborator.save()
        console.log("Collaborator added successfully",result)

        // REMOVE THIS PART LATER
        // removed collaborators array from RepositoryModel, so no need to add collaborator to repository's collaborators array
        // add collaborator to repository's collaborators array
        // const updatedRepo= await RepositoryModel.findByIdAndUpdate(repoId,{$push:{collaborators:result._id}},{new:true})
        // console.log("Repository updated with new collaborator",updatedRepo)

        res.status(201).json({message:"Collaborator added",payload:result})
    }catch(err){
        console.log("error in adding collaborator",err)
        res.status(500).json({message:"error in adding collaborator"})
    }
}