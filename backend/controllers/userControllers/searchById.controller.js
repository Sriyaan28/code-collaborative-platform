import { UserModel } from "../../models/UserModel.js";

export const searchUsersByIdController = async (req, res) => {
    try{
        const uid=req.params.id

        const userobj=await UserModel.findById(uid)

        if(!userobj){
            return res.status(404).json({message:"user not found"})
        }

        res.status(200).json({message:"user found",payload:userobj})
    }
    catch(err){
        console.log("error in getting user",err)
        res.status(500).json({message:"error in getting user"})
    }
}