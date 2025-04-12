// NotificationConsumer.js

export async function consumeNotificationEvent({connectRabbitMQ, sendNotification, queueName = "notifications_queue"}) {
    try {
        const channel = await connectRabbitMQ();

        await channel.assertQueue(queueName, { durable: true });
        console.log(`Waiting for messages in ${queueName}...`);

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const { userId, message, type } = JSON.parse(msg.content.toString());
                await sendNotification(userId, message, type);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error in NotificationConsumer:", error);
    }
}