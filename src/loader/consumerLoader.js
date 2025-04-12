import { consumeNotificationEvent } from "../modules/notifications/NotificationConsumer.js";
import { connectRabbitMQ } from "../infrastructure/messaging/rabbitmq.js";
import NotificationRepository from "../modules/notifications/NotificationRepository.js";
import NotificationService from "../modules/notifications/NotificationService.js";

export default async function consumerLoader() {
    const notificationService = new NotificationService(NotificationRepository);

    await consumeNotificationEvent({
        connectRabbitMQ,
        sendNotification: notificationService.sendNotification.bind(notificationService)
    });
}