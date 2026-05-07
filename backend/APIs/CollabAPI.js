import exp from 'express';
import { addCollabController } from '../controllers/collabControllers/add.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

export const collabApp = exp.Router()

// route for adding a collaborator to a repository
collabApp.post('/collaborator',verifyToken,addCollabController)

// route for removing a collaborator from a repository
