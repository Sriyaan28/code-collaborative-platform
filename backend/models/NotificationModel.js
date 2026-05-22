import { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User not defined"]
    },

    message: {
        type: String,
        required: [true, "Message required"]
    },

    isSeen: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        // fix suggested: add filters to optimize query e.g instead of iterating over all notifications, we can filter by type
        enum: ['USER_LOGIN', 'PROFILE_UPDATED',
            'REPOSITORY_CREATED', 'REPOSITORY_UPDATED', 'REPOSITORY_DELETED',
            'FILE_CREATED', 'FILE_UPDATED', 'FILE_DELETED', 'FILE_RESTORED',
            'PR_CREATED', 'PR_MERGED', 'PR_CLOSED', 'PR_DELETED',
            'BRANCH_CREATED', 'BRANCH_DELETED', 'COMMIT_CREATED', 'COMMIT_ROLLBACK',
            'COLLAB_ADDED', 'COLLAB_REMOVED',
            'COMMENT_ADDED', 'ISSUE_ASSIGNED'
        ],
        required: [true, "Notification type required"]
    },

    reference_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Reference id required"]
    },

    reference_type: {
        type: String,
        enum: ['PR', 'ISSUE', 'REPOSITORY', 'BRANCH', 'USER', 'COMMENT', 'COLLABORATOR', 'FILE', 'COMMIT'],
        required: [true, "Reference type required"]
    }
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

export const NotificationModel = model("Notification", notificationSchema)
