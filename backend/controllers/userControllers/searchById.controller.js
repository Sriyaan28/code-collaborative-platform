
import { UserModel } from "../../models/UserModel.js";
import { RepositoryModel } from "../../models/RepositoryModel.js";

// get user profile by ID
export const searchUsersByIdController = async (req, res) => {
    try{
        const uid=req.params.id


        const userobj=await UserModel.findById(uid).select("-password") // exclude password from the user object

        if(!userobj){
            return res.status(404).json({message:"User not found"})
        }
        // check if user is active
        if(!userobj.isActive){
            return res.status(403).json({message:"User is currently deactivated"})
        }

        const userObject = userobj.toObject() // convert mongoose document to plain javascript object

        // fetch all repositories of the user and add it to the user object
        const repositories = await RepositoryModel.find({owner:uid,visibility:"PUBLIC"}).select("_id name description visibility owner")
        console.log(repositories)
        userObject.repositories = repositories 
        console.log(userObject)

        // return user object to the client
        res.status(200).json({message:"User found",payload:userObject})
    }
    catch(err){
        console.log("error in getting user",err)
        res.status(500).json({message:"Error in getting user"})
    }
}