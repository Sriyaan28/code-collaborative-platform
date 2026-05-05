import { Schema, model } from 'mongoose';

const fileSchema = new Schema({

    name: {
        type: String,
        required: [true, "File name not defined"]
    },
    repository: {
        type:  Schema.Types.ObjectId,
        ref: 'Repository',
        required: [true, "Repository not defined"] 
    },
    commits:[{
        type: Schema.Types.ObjectId,
        ref: 'Commit' 
    }],
    content:{
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author not defined"]
    }
},{
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const FileModel = model('File', fileSchema);