import { BranchModel } from "../../models/BranchModel.js";

export const getBranchController = async (req, res) => {
    try {
        const { branchId } = req.params;
        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required"
            })
        }
        const branch = await BranchModel.findById(branchId);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Branch fetched successfully",
            payload: branch
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch branch"
        })
    }
}

export const getAllBranchesController = async (req, res) => {
    try {
        const { repoId } = req.params;
        if (!repoId) {
            return res.status(400).json({
                success: false,
                message: "Repo ID is required"
            })
        }
        const branches = await BranchModel.find({ repository: repoId });
        if (!branches) {
            return res.status(404).json({
                success: false,
                message: "Branches not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Branches fetched successfully",
            payload: branches
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch branches"
        })
    }
}

// get branch using branch name
export const getBranchByBranchNameController = async (req, res) => {
    try {
        // user id from middleware
        const uid = req.user.id;

        // branch name and repo id
        const { repoId, branchName } = req.params;

        // check if repo id and branch name are provided
        if (!repoId || !branchName) {
            return res.status(400).json({
                success: false,
                message: "Repo ID and branch name are required"
            })
        }
        const branch = await BranchModel.findOne({ repository: repoId, name: branchName });
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Branch fetched successfully",
            payload: branch
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch branch"
        })
    }
}   