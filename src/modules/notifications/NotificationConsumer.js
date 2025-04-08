import { connectRabbitMQ } from "../../infrastructure/messaging/rabbitmq.js";
import notificationService from "./notificationService.js";

export async function consumeNotificationEvent() {
    try {
        const channel = await connectRabbitMQ();

        await channel.assertQueue("notifications_queue", { durable: true });
        console.log("Waiting for messages in notifications_queue...");

        channel.consume("notifications_queue", async (msg) => {
            if (msg !== null) {
                const { userId, message, type } = JSON.parse(msg.content.toString());
                await notificationService.sendNotification(userId, message, type);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error in NotificationConsumer:", error);
    }
}