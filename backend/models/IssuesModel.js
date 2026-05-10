import { Schema, model } from 'mongoose';
const IssuesSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title not defined"]
    },
    description: {
        type: String,
        required: [true, "Description not defined"]
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: [true, "Repository not defined"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author not defined"]
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    assignees: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
},
    {
        timestamps: true,
        versionKey: false,
        strict: "throw"
    });


export const IssuesModel = model("Issues", IssuesSchema);