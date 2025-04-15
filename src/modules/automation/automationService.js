import AutomationRepository from './AutomationRepository.js';

class AutomationService {
    static async createRuleByTenant(tenantId, data) {
        return AutomationRepository.createForTenant({
            ...data,
            tenantId,
        });
    }

    static async createRuleByProject(tenantId, projectId, data) {
        return AutomationRepository.createForProject({
            ...data,
            tenantId,
            projectId,
        });
    }

    static async hasActiveRules({ trigger, projectId }) {
        const rules = await AutomationRepository.findByProject(projectId);
        return rules.some(rule => rule.trigger === trigger && rule.enabled);
    }

    static async getRulesByTenant(tenantId) {
        return AutomationRepository.findByTenant(tenantId);
    }

    static async getRulesByProject(projectId) {
        return AutomationRepository.findByProject(projectId);
    }

    static async updateTenantRule(tenantId, ruleId, data ) {
        return AutomationRepository.updateForTenant(ruleId, tenantId, data);
    }

    static async updateProjectRule(tenantId, projectId, ruleId, data) {
        return AutomationRepository.updateForProject(ruleId, tenantId, projectId, data);
    }

    static async deleteRule(ruleId, { tenantId }) {
        return AutomationRepository.remove(ruleId, tenantId);
    }
}

export default AutomationService;