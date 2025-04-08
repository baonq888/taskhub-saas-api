import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq";

let connection;
let channel;

export async function connectRabbitMQ() {
    if (!connection) {
        connection = await amqplib.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
    }
    return channel;
}