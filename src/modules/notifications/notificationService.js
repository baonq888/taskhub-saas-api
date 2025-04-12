class NotificationService {
  constructor(notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async sendNotification(userId, message, type = "TASK_DEADLINE") {
    await this.notificationRepository.createNotification(userId, type, message);
    console.log(`Notification sent to User ${userId}: ${message}`);
  }

  async getUserNotifications(userId) {
    return await this.notificationRepository.getUserNotifications(userId);
  }

  async markAsRead(notificationId) {
    return await this.notificationRepository.markNotificationAsRead(notificationId);
  }
}

export default NotificationService;