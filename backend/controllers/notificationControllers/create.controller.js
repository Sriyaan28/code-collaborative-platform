import { NotificationModel } from "../../models/NotificationModel.js";

// NOTE: type of notification is given from the frontend

// create a notification - whenever any action is performed by a user, create a notification for the user
// the frontend handles this request
const createNotificationController = async (req, res) => {
    try {
        const uid = req.user?.id
        if (!uid) {
            return res.status(400).json({ message: "user not found in request" })
        }
        // message is given based on type of notification - in frontend
        const { type, reference_id, reference_type } = req.body
        if (!type || !reference_id || !reference_type) {
            return res.status(400).json({ message: "notification type, reference id and reference type are required" })
        }

        const notification = new NotificationModel({
            user: uid,
            type,
            reference_id,
            reference_type,
            message: generateMessage(type)
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "error in creating notification" })
    }
}

// generate a message based on type of notification - can be modified later
function generateMessage(type) {
    switch (type) {
        case 'USER_CREATED':
            return 'New user created';
        case 'USER_LOGIN':
            return 'User logged in';
        case 'REPOSITORY_CREATED':
            return 'New repository created';
        case 'REPOSITORY_UPDATED':
            return 'Repository updated';
        case 'REPOSITORY_DELETED':
            return 'Repository deleted';
        case 'FILE_CREATED':
            return 'New file created';
        case 'FILE_UPDATED':
            return 'File updated';
        case 'FILE_DELETED':
            return 'File deleted';
        case 'PR_CREATED':
            return 'New pull request created';
        case 'PR_MERGED':
            return 'Pull request merged';
        case 'PR_CLOSED':
            return 'Pull request closed';
        case 'PR_DELETED':
            return 'Pull request deleted';
        case 'BRANCH_CREATED':
            return 'New branch created';
        case 'BRANCH_DELETED':
            return 'Branch deleted';
        case 'COLLAB_ADDED':
            return 'Collaborator added';
        case 'COLLAB_REMOVED':
            return 'Collaborator removed';
        case 'COLLAB_UPDATED':
            return 'Collaborator updated';
        case 'COMMENT_ADDED':
            return 'Comment added';
        case 'ISSUE_ASSIGNED':
            return 'Issue assigned';
    }
}
