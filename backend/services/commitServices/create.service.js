import { CommitModel } from "../../models/CommitModel.js";

// create initial commit of repo when repo is created
export const createInitialCommit = async ({
    repository,
    message,
    branch,
    author,
    files_changed
}) => {
    try {
        const commit = await CommitModel.create({
            repository,
            message,
            branch,
            author,
            files_changed
        });
        return commit;
    } catch (err) {
        console.log(err)
        throw err;
    }
}
