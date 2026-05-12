import exp from 'express'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkRepoAccess } from '../middleware/checkRepoAccess.js'
import { createBranchController } from '../controllers/branchControllers/create.controller.js'
import { getBranchController, getAllBranchesController, getBranchByBranchNameController } from '../controllers/branchControllers/get.controller.js'


export const branchApp = exp.Router()

// route for creating a branch
branchApp.post('/branch', verifyToken, checkRepoAccess, createBranchController)

// route for getting a branch by branchId
branchApp.get('/branch/:branchId', verifyToken, getBranchController)

// route for getting all branches of a repository
branchApp.get('/repo/:repoId', verifyToken, checkRepoAccess, getAllBranchesController)

// route for getting a branch using branch name from a repository
branchApp.get('/repo/:repoId/branch/:branchName', verifyToken, checkRepoAccess, getBranchByBranchNameController)



