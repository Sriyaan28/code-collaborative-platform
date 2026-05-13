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
        enum: ['USER_CREATED', 'USER_LOGIN',
            'REPOSITORY_CREATED', 'REPOSITORY_UPDATED', 'REPOSITORY_DELETED',
            'FILE_CREATED', 'FILE_UPDATED', 'FILE_DELETED',
            'PR_CREATED', 'PR_MERGED', 'PR_CLOSED', 'PR_DELETED',
            'BRANCH_CREATED', 'BRANCH_DELETED',
            'COLLAB_ADDED', 'COLLAB_REMOVED', 'COLLAB_UPDATED',
            'COMMENT_ADDED', 'ISSUE_ASSIGNED'
        ]
    },

    reference_id: {
        type: Schema.Types.ObjectId
    },

    reference_type: {
        type: String,
        enum: ['PR', 'ISSUE', 'REPO', 'COMMENT', 'BRANCH', 'USER']
    }
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

export const NotificationModel = model("Notification", notificationSchema)
