import { rollbackService } from "../../services/commitServices/rollback.service.js";
import { createNotification } from "../../services/notificationServices/create.service.js";

export const rollbackCommitController = async (req, res) => {
    try {
        // logged in user
        const uid = req.user.id;

        // role from middleware
        const role = req.role;

        // access check
        if (role !== "owner") {
            return res.status(403).json({
                message: "Only owner can rollback to a commit",
                success: false
            });
        }

        const { commitId } = req.body;

        if (!commitId) {
            return res.status(400).json({
                message: "commitId is required",
                success: false
            });
        }

        const rollbackResult = await rollbackService(commitId);

        // create notification
        await createNotification({
            user: uid,
            type: "COMMIT_ROLLBACK",
            reference_id: rollbackResult.branch,
            reference_type: "BRANCH"
        });

        return res.status(200).json({
            message: "Rollback successful",
            success: true,
            payload: rollbackResult
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to rollback commit",
            error: err.message,
            success: false
        });
    }
};
