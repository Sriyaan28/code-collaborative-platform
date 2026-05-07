import exp from 'express';

import { verifyToken } from '../middleware/verifyToken.js';
import { getProfileController } from '../controllers/userControllers/getProfile.controller.js';
import { searchUsersByIdController } from '../controllers/userControllers/searchById.controller.js';
import { searchUsersByNameController } from '../controllers/userControllers/searchByName.controller.js';
import { searchUsersByEmailController } from '../controllers/userControllers/searchByEmail.controller.js';

export const userApp = exp.Router()

// route for viewing profile
userApp.get('/profile',verifyToken,getProfileController)

// route for searching users by id
userApp.get('/search/:id',verifyToken,searchUsersByIdController)

// route for searching users by name
userApp.post('/search-name',verifyToken,searchUsersByNameController)

// route for searching users by email
userApp.post('/search-email',verifyToken,searchUsersByEmailController)
