import { Schema, model } from 'mongoose';

const commitSchema = new Schema({
  message: {
    type: String,
    required: true
  },

  repo_id: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: [true, "Repository not defined"]
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author not defined"]
  },

  files_changed: [
    {
      file_id: {
        type: Schema.Types.ObjectId,
        ref: "File"
      },
      changes: {
        type: String
      }
    }
  ]

}, {
  timestamps: true,
  versionKey: false,
  strict: "throw"
});

export const CommitModel = model("Commit", commitSchema);