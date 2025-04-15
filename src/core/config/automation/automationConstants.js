export const TRIGGERS = {
    TASK_CREATED: 'task_created',
    TASK_DEADLINE_APPROACHING: 'task_deadline_approaching',
    TASK_UPDATED: 'task_updated',
};

export const ACTIONS = {
    ASSIGN_USER: 'assign_user',
    NOTIFY_USER: 'notify_user',
};

export const STRATEGIES = {
    ASSIGN_BOARD_OWNER: 'assign_board_owner',
    ASSIGN_PROJECT_ADMIN: 'assign_project_admin',
    ASSIGN_SPECIFIC_USER: 'assign_specific_user',
    ASSIGN_EVENLY: 'assign_evenly',
};