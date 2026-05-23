import { CommitModel } from "../../models/CommitModel.js";

// create initial commit of repo when repo is created
export const createInitialCommit = async ({
    repository,
    message,
    branch,
    author,
    files_changed,
    file_snapshots
}) => {
    try {
        const commit = await CommitModel.create({
            repository,
            message,
            branch,
            author,
            files_changed,
            file_snapshots
        });
        return commit;
    } catch (err) {
        console.log(err)
        throw err;
    }
}
