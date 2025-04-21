import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@localhost:5672";

let connection;
let channel;

export async function connectRabbitMQ(retries = 2, delay = 2000) {
    if (channel) return channel;

    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect to RabbitMQ (try ${i + 1}/${retries})`);
            connection = await amqplib.connect(RABBITMQ_URL, {
                frameMax: 131072
            });
            channel = await connection.createChannel();
            console.log("Connected to RabbitMQ");
            return channel;
        } catch (err) {
            console.log(`Failed to connect: ${err}`);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                if (connection) await connection.close(); // Only close on final error
                throw new Error("Could not connect to RabbitMQ after several attempts.");
            }
        }
    }
}