import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRepoAccess } from '../middleware/checkRepoAccess';
import { getAllCommitsController, getCommitByIdController } from '../controllers/commitControllers/get.controller.js';


export const commitApp = exp.Router()

// route to create a commit
commitApp.post('/commit', verifyToken, checkRepoAccess, createCommitController)

// route to get commit by commitId
commitApp.get('/commit/:commitId', verifyToken, getCommitByIdController)

//route to get all commits in a repo
commitApp.get('/commit/:repoId', verifyToken, checkRepoAccess, getAllCommitsController)

