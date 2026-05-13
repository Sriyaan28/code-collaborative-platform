import { diffLines } from "diff";
import { FileModel } from "../../models/FileModel.js";
import { updateFileService } from "./update.service.js";

export const mergeFilesService = async ({
    sourceFileId,
    mainFileId
}) => {

    // get source file
    const sourceFile = await FileModel.findById(sourceFileId);

    if (!sourceFile) {
        throw new Error("Source file not found");
    }

    // get main file
    const mainFile = await FileModel.findById(mainFileId);

    if (!mainFile) {
        throw new Error("Main file not found");
    }

    /*
        Merge strategy:

        - unchanged lines remain
        - added lines from source are added
        - removed lines from source are removed from main
    */

    const differences = diffLines(
        mainFile.content,
        sourceFile.content
    );

    let mergedContent = "";

    for (const part of differences) {

        // unchanged lines
        if (!part.added && !part.removed) {
            mergedContent += part.value;
        }

        // lines added in source branch
        else if (part.added) {
            mergedContent += part.value;
        }

        // removed lines are skipped,
        // effectively deleting them from main
    }

    // update main file with merged content
    const updatedMainFile = await updateFileService({
        fileId: mainFile._id,
        content: mergedContent
    });

    return updatedMainFile;
};