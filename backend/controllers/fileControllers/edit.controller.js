import {FileModel} from "../../models/FileModel.js";

export const editFileController = async (req, res) => {
    try {
        const uid = req.user.id;
        const fileId = req.params.id;
        const {name, content} = req.body;

        // get repo access role from middleware
        const role = req.role;

        // if user is a viewer, they cannot edit the file
        if (role === 'viewer') {
            return res.status(403).json({message: 'You do not have permission to edit files in this repository',success: false});
        }

        // if user is an owner or collaborator, they can edit the file
        const file = await FileModel.findById(fileId);
        if (!file) {
            return res.status(404).json({message: 'File not found',success: false});
        }
        if(file.isDeleted) {
            return res.status(404).json({message: 'File not found',success: false});
        }
        // update file name and content
        file.name = name || file.name;
        file.content = content || file.content;
        await file.save();
        res.status(200).json({message: 'File updated successfully',payload: file,success: true});
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).json({message: 'Server error',success: false});
    }
}

        