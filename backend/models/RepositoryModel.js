import {Schema,model} from "mongoose";

const repositorySchema = new Schema({
    name:{
        type: String,
        required: [true,"Repository name is required"]
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
    
    collaborators:[
        {
            type: Schema.Types.ObjectId,  
            ref: "Collaborator"
        }
    ],
    
    isActive:{
        type: Boolean,
        default: true
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