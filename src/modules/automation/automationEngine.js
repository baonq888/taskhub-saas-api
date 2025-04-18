import AutomationService from './automationService.js';
import { evaluateConditions } from './helpers/evaluateConditions.js';
import {ACTIONS,} from "../../core/config/automation/automationConstants.js";
import {executeAssignUser, executeMoveToBoard, executeNotifyUser} from "./helpers/executeActionHelper.js";

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

    async executeAction(action, ruleActionPayload, automationContext) {
        const { task, user } = automationContext;

        switch (action) {
            case ACTIONS.ASSIGN_USER:
                await executeAssignUser(task, ruleActionPayload, user);
                break;

            case ACTIONS.NOTIFY_USER:
                await executeNotifyUser(task, ruleActionPayload);
                break;

            case ACTIONS.MOVE_TO_BOARD:
                await executeMoveToBoard(task, ruleActionPayload);
                break;

            default:
                console.warn("Unknown action:", action);
        }
    }
}