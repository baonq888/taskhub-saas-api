import { RabbitMQEventBus } from '../../infrastructure/messaging/rabbitmqEventBus.js';
import AutomationService from './automationService.js';
import { AutomationEngine } from './automationEngine.js';
import { TRIGGERS } from "../../core/config/automation/automationConstants.js";
import { buildAutomationContext } from "./helpers/buildAutomationContext.js";

const eventBus = new RabbitMQEventBus();
const engine = new AutomationEngine();

export async function registerAutomationListeners() {
    await eventBus.subscribe(TRIGGERS.TASK_CREATED, async ({ user, task }) => {
        const hasRules = await AutomationService.hasActiveRules({
            trigger: TRIGGERS.TASK_CREATED,
            projectId: task.projectId,
        });

        if (!hasRules) return;

        const automationContext = buildAutomationContext(TRIGGERS.TASK_CREATED, { user, task });
        await engine.handleTrigger(TRIGGERS.TASK_CREATED, automationContext);
    });
}