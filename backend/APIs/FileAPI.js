import exp from 'express';
import { createFileController } from '../controllers/fileControllers/create.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRepoAccess } from '../middleware/checkRepoAccess.js'
import { editFileController } from '../controllers/fileControllers/edit.controller.js';
import { deleteFileController, deleteFileToggleController } from '../controllers/fileControllers/delete.controller.js';
import { getAllBranchFilesController, getAllFilesController, getAllMainBranchFilesController } from '../controllers/fileControllers/getAll.controller.js';
import { getFileController } from '../controllers/fileControllers/get.controller.js';

export const fileApp = exp.Router()

// route for creating a file
fileApp.post('/file', verifyToken, checkRepoAccess, createFileController)

// route for updating a file
fileApp.put('/file', verifyToken, checkRepoAccess, editFileController)

// route for temporarily deleting a file
fileApp.put('/file/toggle-delete/:fileId', verifyToken, checkRepoAccess, deleteFileToggleController)

// route for permanentely deleting a file
fileApp.delete('/file/:fileId', verifyToken, deleteFileController)

// route for retrieving a file
fileApp.get('/file/:fileId', verifyToken, getFileController)

// route for retrieving all files using repoId
fileApp.get('/repo/:repoId', verifyToken, checkRepoAccess, getAllFilesController)

// route for getting all files of a main branch using repoId
fileApp.get('/repo/:repoId/branch/main', verifyToken, checkRepoAccess, getAllMainBranchFilesController)

// route for getting all files of a branch using repoId and branchId
fileApp.get('/repo/:repoId/branch/:branchId', verifyToken, checkRepoAccess, getAllBranchFilesController)