import { FileModel } from "../../models/FileModel.js";

export const getFileService = async (fileId) => {
    try {
        const file = await FileModel.findById(fileId);
        if (!file) {
            throw new Error("File not found");
        }
        return file;
    } catch (error) {
        console.log(error);
    }
}

export const getAllFilesService = async (repoId) => {
    try {
        const files = await FileModel.find({ repository: repoId });
        return files;
    } catch (error) {
        console.log(error);
    }
}