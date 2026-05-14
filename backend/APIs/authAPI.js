import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { registerController } from '../controllers/authControllers/register.controller.js';
import { loginController } from '../controllers/authControllers/login.controller.js';
import { deleteController } from '../controllers/authControllers/delete.controller.js';
import { updateController } from '../controllers/authControllers/update.controller.js';
import { logoutController } from '../controllers/authControllers/logout.controller.js';
import { getCurrentUserController } from '../controllers/authControllers/getCurrentUser.controller.js';

export const authApp = exp.Router()

//route for frontend checking if user is logged in
authApp.get('/me', verifyToken, getCurrentUserController)

// route for register
authApp.post('/register', registerController)

// route for login
authApp.post('/login', loginController)

// route for updating profile
authApp.put('/profile', verifyToken, updateController)

// route for logout
authApp.get('/logout', verifyToken, logoutController)

// route for deleting account
authApp.delete("/profile", verifyToken, deleteController)


