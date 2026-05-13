import { BranchModel } from "../../models/BranchModel.js";

// delete branch permanently
export const deleteBranch = async ({ branchId }) => {
    try {
        const deletedBranch = await BranchModel.findByIdAndDelete(branchId);
    }
    catch (err) {
        throw err;
    }
}