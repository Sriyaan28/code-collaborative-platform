import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is Required!"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userProfile: {
        type: String,
        default: "https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?semt=ais_hybrid&w=740&q=80"

    },
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw",
    strictPopulate: false
},
);

export const UserModel = model("User", userSchema);