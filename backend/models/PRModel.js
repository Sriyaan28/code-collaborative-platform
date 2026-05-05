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
  
  repo_id: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  status: {
    type: String,
    enum: ['open', 'closed', 'merged'],
    default: 'open'
  },
  
  commits: [
    {
      type: Schema.Types.ObjectId,
      ref: "Commit"
    }
  ],
  
  reviewers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  
  mergedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: "throw"
});


export const PRModel = model("PullRequest", PRSchema);