import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

let connection;
let channel;

export async function connectRabbitMQ(retries = 3, delay = 5000) {
    if (channel) return channel;

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect to RabbitMQ (try ${i + 1}/${retries})`);
            connection = await amqplib.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            console.log("Connected to RabbitMQ");
            return channel;
        } catch (err) {
            console.error(`Failed to connect: ${err.message}`);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw new Error("Could not connect to RabbitMQ after several attempts.");
            }
        }
    }
}