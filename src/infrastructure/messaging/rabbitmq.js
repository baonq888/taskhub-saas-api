import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://user:password@rabbitmq:5672";

let connection;
let channel;

export async function connectRabbitMQ() {
    try {
        if (!connection) {
            console.log("URL connection", RABBITMQ_URL);
            connection = await amqplib.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            console.log("Connected to RabbitMQ");
        }
        return channel;
    } catch (e) {
        console.log(e)
    }

}