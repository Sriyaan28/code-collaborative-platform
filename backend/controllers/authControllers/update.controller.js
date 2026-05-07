import {UserModel} from '../../models/UserModel.js';
import {hash} from 'bcrypt';

export const updateController = async(req,res)=>{
    try
    { 
       const  modifiedUser = req.body;

       // hash password of modifiedUser
         if(modifiedUser.password)
         {
            modifiedUser.password = await hash(modifiedUser.password,12)
         }
       
       const idOfUser = req.user.id

         const user = await UserModel.findById(idOfUser);
        if(!user.isActive)
        {
            return res.status(400).json({message:"User profile is deactivated."})
        }
        // update user
        const updatedUser = await UserModel.findByIdAndUpdate(idOfUser,modifiedUser,{new:true})

        return res.status(200).json({message:"User profile updated successfully",payload:updatedUser})

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({message:"User Update failed",error:err})
    }
}