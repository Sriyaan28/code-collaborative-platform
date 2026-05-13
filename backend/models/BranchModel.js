import { Schema, model } from "mongoose";

const branchSchema = new Schema({
    name: {
        type: String,
        required: [true, "Branch name not defined"],
        trim: true
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: [true, "Repository not defined"]
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const BranchModel = model("Branch", branchSchema);   