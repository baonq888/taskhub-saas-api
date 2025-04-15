import { RabbitMQEventBus } from '../../infrastructure/messaging/rabbitmqEventBus.js';
import AutomationService from './automationService.js';
import { AutomationEngine } from './automationEngine.js';
import {TRIGGERS} from "../../core/config/automation/automationConstants.js";

const eventBus = new RabbitMQEventBus();
const engine = new AutomationEngine();

export async function registerAutomationListeners() {
    await eventBus.subscribe(TRIGGERS.TASK_CREATED, async ({ user, task }) => {
        const hasRules = await AutomationService.hasActiveRules({
            trigger: TRIGGERS.TASK_CREATED,
            projectId: task.projectId,
        });

        if (hasRules) {
            await engine.handleTrigger(TRIGGERS.TASK_CREATED, { user, task });
        }
    });
}