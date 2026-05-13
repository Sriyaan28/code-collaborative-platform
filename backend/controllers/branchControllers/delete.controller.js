import { BranchModel } from "../../models/BranchModel.js";

export const deleteBranchController = async (req, res) => {
    try {
        const branchId = req.params?.branchId;
        const repoId = req.params?.repoId;
        //check if repoId and branchId are provided
        if (!repoId) {
            return res.status(400).json({
                success: false,
                message: "Repository ID is required"
            })
        }
        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required"
            })
        }

        // get role from req
        const role = req.role;

        // only owner can delete branch
        if (role === "viewer" || role === "blocked" || role === "collaborator") {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete a branch"
            })
        }

        // get branch details from branchId
        const branch = await BranchModel.findById(branchId);
        // if branch is not found
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            })
        }
        // check if branch is main branch, main branch cannot be deleted
        if (branch.name === "main") {
            return res.status(400).json({
                success: false,
                message: "Main branch cannot be deleted"
            })
        }

        // control logic in frontend by deleting files from branch

        //delete branch
        await BranchModel.findByIdAndDelete(branchId);

        return res.status(200).json({
            success: true,
            message: "Branch deleted successfully",
            payload: branch
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete branch"
        })
    }
}