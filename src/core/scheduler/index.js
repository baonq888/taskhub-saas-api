import cron from "node-cron";
import DeadlineScheduler from "./task/deadlineScheduler.js";

const DAILY_CRON_SCHEDULE = "0 9 * * *"; // Runs every day at 9 AM UTC

class CronJobs {
  static start() {
    console.log("Starting scheduled tasks...");

    cron.schedule(DAILY_CRON_SCHEDULE, async () => {
      
      console.log("Running task deadline notification job...");
      await DeadlineScheduler.notifyDeadline();
      console.log("Task deadline notifications sent.");


    });

    console.log("Cron jobs scheduled successfully.");
  }
}

export default CronJobs;