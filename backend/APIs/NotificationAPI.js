import exp from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getNotificationsController } from '../controllers/notificationControllers/get.controller.js';
import { readNotificationsController } from '../controllers/notificationControllers/read.controller.js';
import { deleteNotificationController } from '../controllers/notificationControllers/delete.controller.js';

export const notificationApp = exp.Router()

// route for creating notifications
notificationApp.post('/notification', verifyToken, createNotificationController)

// route for marking notifications as read
notificationApp.post('/notifications/mark-read', verifyToken, readNotificationsController)

// route for getting notifications of a user
notificationApp.get('/notifications', verifyToken, getNotificationsController)

// routes for deleting notifications
notificationApp.delete('/notifications/:notificationId', verifyToken, deleteNotificationController)