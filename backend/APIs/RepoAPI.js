import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';

import { createRepoController } from '../controllers/repoControllers/create.controller.js';
import { getAllReposController} from '../controllers/repoControllers/getRepos.controller.js';
import { getRepoByIdController } from '../controllers/repoControllers/getRepoById.controller.js';
import { updateRepoByIdController } from '../controllers/repoControllers/update.controller.js';
import { deleteRepoByIdController } from '../controllers/repoControllers/delete.controller.js';
import { searchRepoByNameController } from '../controllers/repoControllers/searchByname.controller.js';
import { checkRepoAccess } from '../middleware/checkRepoAccess.js';


export const repoApp = exp.Router()

// route for creating a repository
repoApp.post('/repo',verifyToken,createRepoController)

// route for getting all repositories (displays all repositories in the platform where the visibility is public)
repoApp.get('/all-repos',verifyToken,getAllReposController)

// route for getting a repository by id 
repoApp.get('/repo/:id', verifyToken,checkRepoAccess, getRepoByIdController)

// update a repository
repoApp.put('/repo', verifyToken, checkRepoAccess, updateRepoByIdController)

// delete a repository by id
repoApp.delete('/repo/:id', verifyToken,checkRepoAccess, deleteRepoByIdController)

// search repositories by name
repoApp.get('/search',verifyToken,searchRepoByNameController)



