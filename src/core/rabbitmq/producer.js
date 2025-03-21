import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

let connection;
let channel;

async function connectRabbitMQ() {
  if (!connection) {
    connection = await amqplib.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ!");
  }
  return channel;
}

export async function publishToQueue(queue, message) {
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