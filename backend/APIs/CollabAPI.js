import exp from 'express';
import { addCollabController } from '../controllers/collabControllers/add.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import {checkRepoAccess} from '../middleware/checkRepoAccess.js';
import { removeCollaboratorController } from '../controllers/collabControllers/remove.controller.js';
import { getCollaboratorsController } from '../controllers/collabControllers/get.controller.js';
import { updateCollabController } from '../controllers/collabControllers/update.controller.js';

export const collabApp = exp.Router()

// route for adding a collaborator to a repository
collabApp.post('/new',verifyToken,addCollabController)

// route for removing a role from a repository
// DELETE /repos/:repoId/collab/:userId
collabApp.delete('/repos/:id/collab/:userId',verifyToken,checkRepoAccess,removeCollaboratorController)

// route for get collaborators of a repository
 collabApp.get('/collab/:id',verifyToken,checkRepoAccess,getCollaboratorsController)

 // route for updating a collaborator's role in a repository
collabApp.put('/collab/:id' ,verifyToken,checkRepoAccess,updateCollabController)