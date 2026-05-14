import exp from 'express';
import { addCommentController } from '../controllers/commentControllers/add.controller.js';


import { verifyToken } from '../middleware/verifyToken.js';

const commentApp = exp.Router();

commentApp.post('/comment', verifyToken, addCommentController);
/*
commentApp.get('/comments/:fileId', getCommentsController);
commentApp.delete('/comments/:commentId', deleteCommentController);
*/

export { commentApp };