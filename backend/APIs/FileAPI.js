import exp from 'express';
import { createFileController } from '../controllers/fileControllers/create.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import {checkRepoAccess} from '../middleware/checkRepoAccess.js'

export const fileApp = exp.Router()

// route for creating a file
 fileApp.post('/file',verifyToken,checkRepoAccess,createFileController)
