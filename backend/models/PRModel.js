import { Schema, model } from 'mongoose';
const PRSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sourceBranch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },

  targetBranch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: true
  },

  status: {
    type: String,
    enum: ['opened', 'closed', 'merged'],
    default: 'opened'
  },

  mergedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  mergedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: "throw"
});


export const PRModel = model("PullRequest", PRSchema);