import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createDiscussionController } from '../controllers/discussionControllers/create.controller.js';
import { getAllDiscussionsController, getDiscussionByIdController } from '../controllers/discussionControllers/get.controller.js';
import { toggleLikeDiscussionController, addCommentController, deleteCommentController } from '../controllers/discussionControllers/interaction.controller.js';
import { deleteDiscussionController } from '../controllers/discussionControllers/delete.controller.js';

export const discussionApp = exp.Router();

// GET all discussions
discussionApp.get('/', verifyToken, getAllDiscussionsController);

// GET single discussion
discussionApp.get('/:id', verifyToken, getDiscussionByIdController);

// POST create discussion
discussionApp.post('/', verifyToken, createDiscussionController);

// DELETE discussion
discussionApp.delete('/:id', verifyToken, deleteDiscussionController);

// POST toggle like
discussionApp.post('/:id/like', verifyToken, toggleLikeDiscussionController);

// POST add comment
discussionApp.post('/:id/comment', verifyToken, addCommentController);

// DELETE comment
discussionApp.delete('/:id/comment/:commentId', verifyToken, deleteCommentController);
