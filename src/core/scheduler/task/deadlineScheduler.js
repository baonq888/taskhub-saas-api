import { getTasksBeforeDeadline } from "./helper.js";
import { publishToQueue } from "../../rabbitmq/producer.js"; 

class DeadlineScheduler {
  static async notifyDeadline() {
    const tasks = await getTasksBeforeDeadline();

    const promises = tasks
      .filter((task) => task.assignee?.id)
      .map((task) => 
        publishToQueue("notifications_queue", {
          userId: task.assignee.id,
          message: `Reminder: Your task "${task.title}" is due soon!`,
          type: "TASK_DEADLINE",
        })
      );

    await Promise.all(promises); 
  }
}

export default DeadlineScheduler;