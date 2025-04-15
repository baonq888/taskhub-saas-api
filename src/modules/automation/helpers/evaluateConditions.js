export function evaluateConditions(conditions = [], task = {}) {
    for (const cond of conditions) {
        const { condition, value } = cond;
        switch (condition) {
            case 'board_id_equals':
                if (task.boardId !== value) return false;
                break;
            case 'task_status_equals':
                if (task.status !== value) return false;
                break;
            case 'deadline_approaching':
                // deadline check logic here
                break;
            default:
                return false;
        }
    }
    return true;
}