import NotificationRepository from "./NotificationRepository.js";

class NotificationService {
  async sendNotification(userId, message, type = "TASK_DEADLINE") {
    await NotificationRepository.createNotification(userId, type, message);
    console.log(`📢 Notification sent to User ${userId}: ${message}`);
  }

  async getUserNotifications(userId) {
    return await NotificationRepository.getUserNotifications(userId);
  }

  async markAsRead(notificationId) {
    return await NotificationRepository.markNotificationAsRead(notificationId);
  }
}

// Export as a singleton instance
export default new NotificationService();