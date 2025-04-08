import { connectRabbitMQ } from "./rabbitmq.js";

export class RabbitMQEventBus {
    constructor() {
        this.exchange = "domain_events";
    }


    async publish(event) {
        const channel = await connectRabbitMQ();
        await channel.assertExchange(this.exchange, "topic", { durable: true });

        const routingKey = event.name;
        const payload = Buffer.from(JSON.stringify(event));

        channel.publish(this.exchange, routingKey, payload, { persistent: true });
        console.log(`Published event '${routingKey}':`, event);
    }

    async subscribe(eventName, handler) {
        const channel = await connectRabbitMQ();
        await channel.assertExchange(this.exchange, "topic", { durable: true });

        const queue = `queue_${eventName}`;
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, this.exchange, eventName);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const event = JSON.parse(msg.content.toString());
                console.log(`Received event '${eventName}':`, event);
                await handler(event);
                channel.ack(msg);
            }
        });
    }
}