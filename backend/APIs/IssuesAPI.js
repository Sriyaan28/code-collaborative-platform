import exp from 'express';
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRepoAccess } from "../middleware/checkRepoAccess.js";
import { createIssueController } from '../controllers/issueControllers/create.controller.js';
import { deleteIssueController } from '../controllers/issueControllers/delete.controller.js';
import { getIssueController, getAllIssuesController } from '../controllers/issueControllers/get.controller.js';
import { updateIssueStatusController } from '../controllers/issueControllers/update.controller.js';

export const issueApp = exp.Router()

// route to create an issue
issueApp.post('/issue', verifyToken, checkRepoAccess, createIssueController)

// route to delete an issue
issueApp.delete('/issue/:issueId', verifyToken, deleteIssueController)

// route to get an issue
issueApp.get('/issue/:issueId', verifyToken, getIssueController)

// route to update an issue status
issueApp.patch('/issue/:issueId', verifyToken, updateIssueStatusController)

// route to get all issues
issueApp.get('/repo/:repoId/all-issues', verifyToken, checkRepoAccess, getAllIssuesController)
