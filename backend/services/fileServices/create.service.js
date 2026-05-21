import { FileModel } from "../../models/FileModel.js";

export const createFile = async ({
    name,
    content,
    repoId,
    branchId,
    createdBy
}) => {

    if (
        !name ||
        !repoId ||
        !branchId
    ) {

        throw new Error(

            "Name, repoId and branchId are required"
        );
    }

    const newFile =
        new FileModel({

            name,

            content:
                content || "",

            // IMPORTANT
            // INITIAL DIFF STATE
            old_content: null,

            repository: repoId,

            createdBy,

            branch: branchId
        });

    return await newFile.save();
};