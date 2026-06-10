const notificationService = require('../services/notificationService');

async function createNotification(req, res, next) {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
}

async function getAllNotifications(req, res, next) {
  try {
    const notifications = notificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

async function getNotificationById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const notification = notificationService.getNotificationById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById
};
