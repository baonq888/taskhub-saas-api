import cron from "node-cron";
import DeadlineScheduler from "./task/deadlineScheduler.js";

const DAILY_CRON_SCHEDULE = process.env.NODE_ENV === 'production'
    ? "0 9 * * *" // every day at 9 AM UTC in prod
    : "*/10 * * * * *"; // every 10 seconds in dev

class CronJobs {
  static start() {
    console.log("Starting scheduled tasks...");

    cron.schedule(DAILY_CRON_SCHEDULE, async () => {
      try {
        console.log("Running task deadline notification job...");
        await DeadlineScheduler.notifyDeadline();
        console.log("Task deadline notifications sent.");
      } catch (error) {
        console.error("Error running scheduled task:", error);
      }
    });

    console.log("Cron jobs scheduled successfully.");
  }
}

export default CronJobs;