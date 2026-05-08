import exp from 'express';
import { createFileController } from '../controllers/fileControllers/create.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import {checkRepoAccess} from '../middleware/checkRepoAccess.js'
import { editFileController } from '../controllers/fileControllers/edit.controller.js';
import { deleteFileToggleController } from '../controllers/fileControllers/deleteToggle.controller.js';
import { getAllFilesController } from '../controllers/fileControllers/getAll.controller.js';
import { getFileController } from '../controllers/fileControllers/get.controller.js';

export const fileApp = exp.Router()

// route for creating a file
 fileApp.post('/file',verifyToken,checkRepoAccess,createFileController)

 // route for updating a file
 fileApp.put('/file/:fileId',verifyToken,checkRepoAccess,editFileController)

// route for deleting a file
fileApp.put('/file/toggle-delete',verifyToken,checkRepoAccess,deleteFileToggleController)

// route for retrieving a file
fileApp.get('/file/:fileId',verifyToken,getFileController)

// route for retrieving all files using repoId
fileApp.get('/repo/:id',verifyToken,checkRepoAccess,getAllFilesController)