import { Schema, model } from 'mongoose';

const discussionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    mentionedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    linkedRepositories: [{
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
});

export const DiscussionModel = model("Discussion", discussionSchema);
