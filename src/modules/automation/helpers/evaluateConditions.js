export function evaluateConditions(conditions = [], context = {}) {
    for (const cond of conditions) {
        const { condition, value } = cond;

        if (condition.startsWith('task_')) {
            const task = context.task;
            if (!task) return false;

            switch (condition) {
                case 'task_status_equals':
                    if (task.status !== value) return false;
                    break;
                case 'task_priority_equals':
                    if (task.priority !== value) return false;
                    break;
                default:
                    return false;
            }

        } else if (condition.startsWith('board_')) {
            const board = context.board;
            if (!board) return false;

            switch (condition) {
                case 'board_id_equals':
                    if (board.id !== value) return false;
                    break;
                case 'board_title_equals':
                    if (board.title !== value) return false;
                    break;
                default:
                    return false;
            }

        } else if (condition === 'deadline_approaching') {
            const task = context.task;
            if (!task?.deadline) return false;
            const deadline = new Date(task.deadline);
            const now = new Date();
            const diffHours = (deadline - now) / (1000 * 60 * 60);
            if (diffHours > 24) return false;
        } else {
            return false;
        }
    }

    return true;
}