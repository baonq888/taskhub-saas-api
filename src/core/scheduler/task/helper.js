import prisma from "../../../core/db/index.js";
import { subDays, startOfDay, endOfDay } from "date-fns";

const DAYS_BEFORE_DEADLINE = 3;


export async function getAllTasksBeforeDeadline() {
    const today = new Date();
    const targetDate = subDays(today, DAYS_BEFORE_DEADLINE);
    return prisma.task.findMany({
        where: {
            deadline: {
                gte: startOfDay(targetDate), // Start of the target day
                lte: endOfDay(targetDate),   // End of the target day
            },
            assignedTo: { not: null }, 
        },
        include: {
        assignee: { select: { id: true, email: true } }, 
        },
    });
}

