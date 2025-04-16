import AutomationService from './automationService.js';
import { evaluateConditions } from './helpers/evaluateConditions.js';

export class AutomationEngine {

    async handleTrigger(trigger, automationContext) {
        const rules = await AutomationService.getRulesByProject(automationContext.projectId);
        // apply only enabled conditions
        const filtered = rules.filter(r => r.trigger === trigger && r.enabled);
        for (const rule of filtered) {
            const passed = evaluateConditions(rule.conditions, automationContext);
            if (passed) {
                await this.executeAction(rule.actionType, rule.actionPayload, automationContext);
            }
        }
    }

    async executeAction(action, payload, automationContext) {
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