import AutomationService from './automationService.js';
import { evaluateConditions } from './helpers/evaluateConditions.js';

export class AutomationEngine {

    async handleTrigger(trigger, context) {
        const rules = await AutomationService.getRulesByProject(context.user);
        const filtered = rules.filter(r => r.trigger === trigger && r.enabled);

        for (const rule of filtered) {
            const passed = evaluateConditions(rule.conditions, context.task);
            if (passed) {
                await this.executeAction(rule.actionType, rule.actionPayload, context);
            }
        }
    }

    async executeAction(action, payload, context) {
        switch (action) {
            case 'assign_user':
                // implement assignment logic
                break;
            case 'notify_user':
                // implement notification logic
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }
}