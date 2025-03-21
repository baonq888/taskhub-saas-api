import amqplib from "amqplib";
import NotificationRepository from "./NotificationRepository.js";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

class NotificationService {
  async sendNotification(userId, message, type = "TASK_DEADLINE") {
    await NotificationRepository.createNotification(userId, type, message);
    console.log(`Notification sent to User ${userId}: ${message}`);
  }

  async getUserNotifications(userId) {
    return await NotificationRepository.getUserNotifications(userId);
  }

  async markAsRead(notificationId) {
    return await NotificationRepository.markNotificationAsRead(notificationId);
  }

  async consumeNotifications() {
    try {
      const connection = await amqplib.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();

      await channel.assertQueue("notifications_queue", { durable: true });

      console.log("Waiting for messages in notifications_queue...");

      channel.consume("notifications_queue", async (msg) => {
        if (msg !== null) {
          const { userId, message, type } = JSON.parse(msg.content.toString());
          await this.sendNotification(userId, message, type);
          channel.ack(msg); 
        }
      });
    } catch (error) {
      console.error("Error in consuming notifications:", error);
    }
  }
}

const notificationService = new NotificationService();
notificationService.consumeNotifications(); 

export default notificationService;