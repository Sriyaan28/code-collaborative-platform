import {CommentModel} from '../../models/CommentModel.js'

// fixes required: fileId should be named as parent_id and parent_type should be FILE

export const addCommentController = async (req,res)=>{
    try{
        const {fileId, content}=req.body
        const uid=req.user?.id || req.user?._id
        if(!content){
            return res.status(400).json({message:"comment content is required"})
        }
        const newComment=new CommentModel({content,user:uid,file:fileId })

        await newComment.save()
        res.status(201).json({message:"comment added successfully",payload:newComment})
    }
    catch(err){
        console.log("error in adding comment",err)
        res.status(500).json({message:"error in adding comment"})
    }
}