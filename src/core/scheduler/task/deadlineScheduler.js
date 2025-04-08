import { getAllTasksBeforeDeadline } from "./helper.js";
import RabbitMQMessageQueue from "../../../infrastructure/messaging/RabbitMQMessageQueue.js";

class DeadlineScheduler {
  static async notifyDeadline() {
    const tasks = await getAllTasksBeforeDeadline();

    const promises = tasks
      .filter((task) => task?.assignee?.id)
      .map((task) =>
          RabbitMQMessageQueue.send("notifications_queue", {
          userId: task?.assignee.id,
          message: `Reminder: Your task "${task.title}" is due soon!`,
          type: "TASK_DEADLINE",
        })
      );

    await Promise.all(promises);
  }
}

export default DeadlineScheduler;