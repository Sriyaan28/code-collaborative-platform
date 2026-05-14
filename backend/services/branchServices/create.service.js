import { BranchModel } from "../../models/BranchModel.js";

// create branch
export const createBranchService = async ({ name, repoId }) => {
    try {
        const branch = await BranchModel.create({ name, repository: repoId });
        return branch;
    }
    catch (err) {
        throw err;
    }
}
