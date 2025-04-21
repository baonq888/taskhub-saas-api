import prisma from "../../infrastructure/db/index.js";

class NotificationRepository {
  async createNotification(userId, type, message) {
    return prisma.notification.create({
      data: { userId, type, message },
    });
  }

  async getUserNotifications(userId) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async markNotificationAsRead(notificationId) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}

// Export as a singleton instance
export default new NotificationRepository();