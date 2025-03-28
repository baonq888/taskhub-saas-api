import prisma from "../../core/db/index.js";

class NotificationRepository {
  async createNotification(userId, type, message) {
    return await prisma.notification.create({
      data: { userId, type, message },
    });
  }

  async getUserNotifications(userId) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markNotificationAsRead(notificationId) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}

// Export as a singleton instance
export default new NotificationRepository();