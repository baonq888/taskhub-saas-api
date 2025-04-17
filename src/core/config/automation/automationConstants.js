export const TRIGGERS = {
    TASK_CREATED: 'task_created',
    TASK_DEADLINE_APPROACHING: 'task_deadline_approaching',
    TASK_UPDATED: 'task_updated',
};

export const CONDITIONS_PREFIX = {
    TASK: 'task',
    BOARD: 'board',
}

export const CONDITIONS = {
    TASK_STATUS_EQUALS: `${CONDITIONS_PREFIX.TASK}_status_equals`,
    TASK_PRIORITY_EQUALS: `${CONDITIONS_PREFIX.TASK}_priority_equals`,
    TASK_DEADLINE_APPROACHING: `${CONDITIONS_PREFIX.TASK}_deadline_approaching`,
    BOARD_NAME_EQUALS: `${CONDITIONS_PREFIX.BOARD}_name_equals`,
};

export const ACTIONS = {
    ASSIGN_USER: 'assign_user',
    NOTIFY_USER: 'notify_user',
    MOVE_TO_BOARD: 'move_to_board'
};

export const STRATEGIES = {
    ASSIGN_SPECIFIC_USER: 'assign_specific_user',
    ASSIGN_EVENLY: 'assign_evenly',
};

export const ACTION_PAYLOAD_CONFIG = {
    ASSIGN_USER: {
        description: "Assign a user to the task",
        requiredFields: ["strategy"],
        optionalFields: ["userId"],
        strategyOptions: ["assign_evenly", "assign_specific_user"],
        example: {
            strategy: "assign_specific_user",
            userId: "user-123"
        }
    },

    NOTIFY_USER: {
        description: "Send a notification to specific users",
        requiredFields: ["message", "recipients"],
        optionalFields: [],
        example: {
            message: "Deadline approaching!",
            recipients: ["user-1", "user-2"]
        }
    },

    MOVE_TO_BOARD: {
        description: "Move task to another board",
        requiredFields: [],
        optionalFields: ["boardId", "boardName"],
        example: {
            boardName: "Done"

        }
    }
};