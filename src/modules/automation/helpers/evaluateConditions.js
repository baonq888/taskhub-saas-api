import {CONDITIONS, CONDITIONS_PREFIX} from "../../../core/config/automation/automationConstants.js";

export function evaluateConditions(conditions = [], context = {}) {
    for (const cond of conditions) {
        const { condition, value } = cond;

        if (condition.startsWith(CONDITIONS_PREFIX.TASK)) {
            const task = context.task;
            if (!task) return false;

            switch (condition) {
                case CONDITIONS.TASK_STATUS_EQUALS:
                    if (task.status !== value) return false;
                    break;
                case CONDITIONS.TASK_PRIORITY_EQUALS:
                    if (task.priority !== value) return false;
                    break;
                case CONDITIONS.TASK_DEADLINE_APPROACHING:
                    if (!task?.deadline) return false;
                    const deadline = new Date(task.deadline);
                    const now = new Date();
                    const diffHours = (deadline - now) / (1000 * 60 * 60);
                    if (diffHours > 24) return false;
                    break;
                default:
                    return false;
            }

        } else if (condition.startsWith(CONDITIONS_PREFIX.BOARD)) {
            const board = context.board;
            if (!board) return false;

            switch (condition) {
                case CONDITIONS.BOARD_NAME_EQUALS:
                    if (board.id !== value) return false;
                    break;
                default:
                    return false;
            }

        } else {
            return false;
        }
    }

    return true;
}