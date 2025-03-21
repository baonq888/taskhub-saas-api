import { getTasksBeforeDeadline } from "./helper.js";
import { publishToQueue } from "../../rabbitmq/producer.js"; 

class DeadlineScheduler {
  static async notifyDeadline() {
    const tasks = await getTasksBeforeDeadline();

    for (const task of tasks) {
      if (task.assignee?.id) {
        const notificationMessage = {
          userId: task.assignee.id,
          message: `Reminder: Your task "${task.title}" is due soon!`,
          type: "TASK_DEADLINE",
        };

        await publishToQueue("notifications_queue", notificationMessage);
      }
    }
  }
}

export default DeadlineScheduler;