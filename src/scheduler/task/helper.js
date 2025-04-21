import prisma from "../../infrastructure/db/index.js";
import { subDays, startOfDay, endOfDay } from "date-fns";

const DAYS_BEFORE_DEADLINE = 3;

export async function getAllTasksBeforeDeadline() {
    const today = new Date();
    const targetDate = subDays(today, DAYS_BEFORE_DEADLINE);

    return prisma.task.findMany({
        where: {
            status: 'IN_PROGRESS',
            deadline: {
                gte: startOfDay(targetDate),
                lte: endOfDay(targetDate),
            },
        },
        include: {
            TaskAssignee: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
}