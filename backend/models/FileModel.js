import { Schema, model } from 'mongoose';

const fileSchema = new Schema({

    name: {
        type: String,
        required: [true, "File name not defined"],
        trim: true
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: 'Repository',
        required: [true, "Repository not defined"]
    },
    branch:
    {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: [true, "Branch not defined"]
    },
    old_content: {
        type: String,
        default: ""
    },
    content: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author not defined"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    modifiedAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const FileModel = model('File', fileSchema);