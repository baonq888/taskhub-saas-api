import { connectRabbitMQ } from "./rabbitmq.js";

class RabbitMQMessageQueue  {
    static async send(queue, message) {
        try {
            const channel = await connectRabbitMQ();
            await channel.assertQueue(queue, { durable: true });

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                persistent: true,
            });

            console.log(`Message sent to queue ${queue}:`, message);
        } catch (error) {
            console.error("Error in publishing message:", error);
        }
    }
}

export default RabbitMQMessageQueue;