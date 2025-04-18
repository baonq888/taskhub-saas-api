export function buildAutomationContext(trigger, payload) {
    const timestamp = Date.now();

    // Task-scoped automation
    if (payload.task) {
        return {
            trigger,
            user: payload.user,
            task: payload.task,
            projectId: payload.task?.board?.projectId,
            triggeredBy: payload.user?.id,
            timestamp,
        };
    }

    // Project-scoped automation
    if (payload.project) {
        return {
            trigger,
            user: payload.user,
            project: payload.project,
            projectId: payload.project?.id,
            triggeredBy: payload.user?.id,
            timestamp,
        };
    }

    // Tenant-scoped automation
    if (payload.tenant) {
        return {
            trigger,
            tenant: payload.tenant,
            user: payload.user,
            projectId: undefined,
            triggeredBy: payload.user?.id,
            timestamp,
        };
    }

    throw new Error('Unknown context type for automation');
}