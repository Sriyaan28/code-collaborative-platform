import exp from 'express';
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRepoAccess } from "../middleware/checkRepoAccess.js";
import { createIssueController } from '../controllers/issueControllers/create.controller.js';

export const issueApp = exp.Router()

// route to create an issue
issueApp.post('/issue', verifyToken, checkRepoAccess, createIssueController)
