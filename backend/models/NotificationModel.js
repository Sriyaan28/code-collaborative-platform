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
        type: String
        // fix suggested:
        //,enum: [ 'COLLAB_ADDED' , 'PR_CREATED' , 'PR_MERGED' , 'COMMENT_ADDED' , 'ISSUE_ASSIGNED' ]
    },

    reference_id: {
        type: Schema.Types.ObjectId
    },

    reference_type: {
        type: String,
        enum: ['PR', 'ISSUE', 'REPO', 'COMMENT']
    }
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

export const NotificationModel = model("Notification", notificationSchema)
