// this feature can be implemented later
import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    parent_type: {
        type: String,
        enum: ['PR', 'ISSUE', 'FILE']
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

export const CommentModel = model("Comment", commentSchema)