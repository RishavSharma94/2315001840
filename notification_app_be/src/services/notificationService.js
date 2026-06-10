const emailService = require('./emailService');
const smsService = require('./smsService');
const inAppService = require('./inAppService');

const notifications = [];
let nextId = 1;

function getAllNotifications() {
  return notifications;
}

function getNotificationById(id) {
  return notifications.find((item) => item.id === id);
}

async function createNotification(payload) {
  const { type, recipient, message } = payload;
  if (!type || !recipient || !message) {
    const error = new Error('type, recipient, and message are required');
    error.status = 400;
    throw error;
  }

  const notification = {
    id: nextId++,
    type,
    recipient,
    message,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);

  let status = 'FAILED';
  if (type === 'EMAIL') {
    status = await emailService.sendEmail(notification) ? 'SENT' : 'FAILED';
  } else if (type === 'SMS') {
    status = await smsService.sendSms(notification) ? 'SENT' : 'FAILED';
  } else if (type === 'IN_APP') {
    status = await inAppService.sendInApp(notification) ? 'SENT' : 'FAILED';
  } else {
    status = 'FAILED';
  }

  notification.status = status;
  notification.updatedAt = new Date().toISOString();

  return notification;
}

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById
};
