import { consumeNotificationEvent } from "../modules/notifications/NotificationConsumer.js";

export default async function consumerLoader() {
    await consumeNotificationEvent();
}