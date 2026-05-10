import exp from 'express';
import { addCollabController } from '../controllers/collabControllers/add.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import {checkRepoAccess} from '../middleware/checkRepoAccess.js';
import { deleteCollaboratorByIdController, removeCollaboratorController } from '../controllers/collabControllers/remove.controller.js';
import { getCollaboratorsController } from '../controllers/collabControllers/getAll.controller.js';
import { updateCollabController } from '../controllers/collabControllers/update.controller.js';
import {getCollaboratorByIdController} from '../controllers/collabControllers/get.controller.js'

export const collabApp = exp.Router()

// route for adding a collaborator to a repository
collabApp.post('/new',verifyToken,addCollabController)

// route for getting all collaborators of a repository by repo id
 collabApp.get('/collabs/:repoId',verifyToken,checkRepoAccess,getCollaboratorsController)

 // route for getting a collaborator using collab id
 collabApp.get('/collab/:collabId',verifyToken,getCollaboratorByIdController)

 // route for updating a collaborator's role in a repository
collabApp.put('/collab/:id' ,verifyToken,checkRepoAccess,updateCollabController)

// route for deleting a collaborator using collabId
collabApp.delete('/collab/:collabId',verifyToken,deleteCollaboratorByIdController)

// route for removing a role using userId
// DELETE /repos/:repoId/collab/:userId
collabApp.delete('/repos/:repoId/collab/:userId',verifyToken,checkRepoAccess,removeCollaboratorController)