import { getTasksBeforeDeadline } from "./helper.js";
import NotificationService from "../../notifications/notificationService.js";

class DeadlineScheduler {
  static async notifyDeadline() {
    const tasks = await getTasksBeforeDeadline();

    for (const task of tasks) {
      if (task.assignee?.id) {
        await NotificationService.sendNotification(
          task.assignee.id,
          `Reminder: Your task "${task.title}" is due soon!`,
          "TASK_DEADLINE"
        );
      }
    }
  }
}

export default DeadlineScheduler;