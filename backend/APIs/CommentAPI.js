import exp from 'express';
import { addCommentController } from '../controllers/commentControllers/add.controller.js';
import { getAllCommentsByParentIdController } from '../controllers/commentControllers/get.controller.js';
import { deleteCommentByIdController } from '../controllers/commentControllers/delete.controller.js';


import { verifyToken } from '../middleware/verifyToken.js';

export const commentApp = exp.Router();

// route to create new comment
commentApp.post('/comment', verifyToken, addCommentController);

// route to get all comments of a file, issue or pr by parent id(parent_id can be fileId, prId or issueId)
commentApp.get('/all-comments/:parentId', verifyToken, getAllCommentsByParentIdController);

// route to delete a comment by commentId
commentApp.delete('/comment/:commentId', verifyToken, deleteCommentByIdController);
