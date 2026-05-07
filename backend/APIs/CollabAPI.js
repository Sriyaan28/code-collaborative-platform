import exp from 'express';
import { addCollabController } from '../controllers/collabControllers/add.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

export const collabApp = exp.Router()

// route for adding a collaborator to a repository
collabApp.post('/collab',verifyToken,addCollabController)

// route for removing a collaborator from a repository
// collabApp.delete('/collab',verifyToken,deleteCollabController)

// route for getting all collaborators of a repository
// collabApp.get('/collab/:repoId',verifyToken,getCollabsByRepoIdController)

