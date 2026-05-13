import { FileModel } from "../../models/FileModel.js";
// delete files by id
export const deleteFile = async ({ fileId }) => {
    try {
        const file = await FileModel.findByIdAndDelete(fileId);
        return file;
    }
    catch (err) {
        throw err;
    }
}