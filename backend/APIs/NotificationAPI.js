import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getNotificationByIdController, getNotificationsController } from '../controllers/notificationControllers/get.controller.js';
import { deleteNotificationController, deleteAllNotificationsController } from '../controllers/notificationControllers/delete.controller.js';
import { createNotificationController } from '../controllers/notificationControllers/create.controller.js'
import { markAllAsReadController } from '../controllers/notificationControllers/mark.controller.js';

export const notificationApp = exp.Router()

// route for creating notifications
notificationApp.post('/notification', verifyToken, createNotificationController)

// route for getting all notifications of a user
notificationApp.get('/all-notifications', verifyToken, getNotificationsController)

// route for getting a notification by ID (marks as read, if user views notification)
notificationApp.get('/notification/:notificationId', verifyToken, getNotificationByIdController)

// route to mark all notifications as read
notificationApp.put('/all-notifications', verifyToken, markAllAsReadController)

// route for deleting all notifications
notificationApp.delete('/all-notifications', verifyToken, deleteAllNotificationsController)

// route for deleting notification by id 
notificationApp.delete('/notification/:notificationId', verifyToken, deleteNotificationController)
