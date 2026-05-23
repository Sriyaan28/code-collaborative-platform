import { Schema, model } from 'mongoose';

const commitSchema = new Schema({
  message: {
    type: String,
    required: true
  },

  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: [true, "Repository not defined"]
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author not defined"]
  },

  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch not defined"]
  },

  files_changed: [
    {
      file_id: {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true
      },
      content: {
        old_content: {
          type: String,
          default: ""
        },
        new_content: {
          type: String,
          default: ""
        }
      },
      action: {
        type: String,
        enum: ["CREATE", "UPDATE", "DELETE"],
        required: true
      }
    }
  ],

  file_snapshots: [
    {
      file_id: {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      content: {
        type: String,
        default: ""
      }
    }
  ]

}, {
  timestamps: true,
  versionKey: false,
  strict: "throw"
});

export const CommitModel = model("Commit", commitSchema);