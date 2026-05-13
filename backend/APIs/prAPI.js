import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkRepoAccess } from '../middleware/checkRepoAccess.js'
import { createPullRequestController } from '../controllers/prControllers/create.controller.js'
import { getAllPullRequestController, getPullRequestController } from '../controllers/prControllers/get.controller.js'
import { updatePRStatusController } from '../controllers/prControllers/update.controller.js'
import { deletePullRequestController } from '../controllers/prControllers/delete.controller.js'

export const prApp = exp.Router()

// create a pull request
prApp.post('/pull-request', verifyToken, checkRepoAccess, createPullRequestController)

// get all pull request from a repo using repoId
prApp.get('/repo/:repoId/pull-request', verifyToken, checkRepoAccess, getAllPullRequestController)

// get pull request using prId
prApp.get('/pull-request/:prId', verifyToken, getPullRequestController)

// update pr status using prId
prApp.put('/pull-request/:prId', verifyToken, updatePRStatusController)

// delete pr using prId
prApp.delete('/pull-request/:prId', verifyToken, deletePullRequestController)