import {Schema,model} from "mongoose";

const repositorySchema = new Schema({
    name:{
        type: String,
        required: [true,"Repository name is required"],
        match: [/^[a-zA-Z0-9-_]+$/, "Repository name can only contain letters, numbers, hyphens and underscores"]
    },
    description:{
        type: String,
    },
    visibility:{
        type: String,
        enum: ['PUBLIC', 'PRIVATE'],
        default: 'PUBLIC'
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isActive:{
        type: Boolean,
        default: true
    },
    mainReadmeFile: {
        type: Schema.Types.ObjectId,
        ref: "File"
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
},{
    versionKey:false,
    timestamps:true
})

export const RepositoryModel = model("Repository",repositorySchema)