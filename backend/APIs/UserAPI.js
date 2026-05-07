import exp from 'express';

import { verifyToken } from '../middleware/verifyToken.js';
import { getProfileController } from '../controllers/userControllers/getProfile.controller.js';
import { searchUsersByIdController } from '../controllers/userControllers/searchById.controller.js';
import { searchUsersController } from '../controllers/userControllers/search.controller.js';

export const userApp = exp.Router()

// route for viewing your profile
userApp.get('/profile',verifyToken,getProfileController)

// route for searching user by id
userApp.get('/user/:id',verifyToken,searchUsersByIdController)

// route for searching users by name and email
userApp.get('/search',verifyToken,searchUsersController)
