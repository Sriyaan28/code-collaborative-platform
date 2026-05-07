import { Schema,model } from "mongoose";
// COLLABORATOR:
//     - collab_id
//     - user(user_id)
//     - repo(repo_id)
//     - role(owner,collaborator,viewer)
//     - addedAt(timestamp)

const collaboratorSchema = new Schema({
    role:{
        type:String,
        enum: ['collaborator', 'viewer'],
        required:[true,"Role not defined"]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref: "User",
        required:[true,"User not defined"]
    },
    repo:{
        type: Schema.Types.ObjectId,
        ref:"Repository",
        required:[true,"Repository not defined"]
    }
},{
    versionKey: false,
    timestamps:true
});

export const CollaboratorModel = model("Collaborator",collaboratorSchema)