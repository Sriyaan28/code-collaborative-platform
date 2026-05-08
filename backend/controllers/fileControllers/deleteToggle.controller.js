import {FileModel} from "../../models/FileModel.js";

export const deleteFileToggleController = async(req,res) => {
    try
    {
        // PUT /api/files/file/:fileId -> soft delete a file by setting isDeleted to true
        // Get fileId from params
        const fileId = req.params.fileId;
        const repoId = req.body.repoId; 
        
        // find file by id and repoId
        const file = await FileModel.findOne({_id: fileId, repoId: repoId});
        if(!file){
            return res.status(404).json({message: "File not found"});
        }
        // check if isDeleted status is same as the one in request body, if same then return error
        if(file.isDeleted === req.body.isDeleted){
            return res.status(400).json({message: `File is already ${file.isDeleted ? "deleted" : "active"}`});
        }
        // update isDeleted status
        file.isDeleted = req.body.isDeleted;
        await file.save();
        res.status(200).json({message: "File deleted successfully", file});
    }
    catch(err){
        res.status(500).json({message: "Error deleting file", error: err.message});
    }
}