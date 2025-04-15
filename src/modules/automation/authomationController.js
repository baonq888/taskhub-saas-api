import AutomationService from './automationService.js';
import { successResponse, errorResponse } from '../../core/response/repsonse.js';

class AutomationController {

    static async createRuleByTenant(req, res) {
        try {
            const { tenantId } = req.params;
            const data = req.body;
            const rule = await AutomationService.createRuleByTenant(tenantId, data);

            return successResponse(res, 201, 'Tenant-level automation rule created successfully', { rule });
        } catch (error) {
            console.error('Error creating tenant automation rule:', error);
            return errorResponse(res, 500, 'Failed to create tenant automation rule', error.message);
        }
    }

    static async createRuleByProject(req, res) {
        try {
            const { tenantId, projectId } = req.params;
            const data = req.body;
            const rule = await AutomationService.createRuleByProject(tenantId, projectId, data);

            return successResponse(res, 201, 'Project-level automation rule created successfully', { rule });
        } catch (error) {
            console.error('Error creating project automation rule:', error);
            return errorResponse(res, 500, 'Failed to create project automation rule', error.message);
        }
    }

    static async getRulesByTenant(req, res) {
        try {
            const { tenantId } = req.params;
            const rules = await AutomationService.getRulesByTenant(tenantId);

            return successResponse(res, 200, 'Tenant automation rules fetched successfully', { rules });
        } catch (error) {
            console.error('Error fetching tenant automation rules:', error);
            return errorResponse(res, 500, 'Failed to fetch tenant automation rules', error.message);
        }
    }

    static async getRulesByProject(req, res) {
        try {
            const { projectId } = req.params;
            const rules = await AutomationService.getRulesByProject(projectId);

            return successResponse(res, 200, 'Project automation rules fetched successfully', { rules });
        } catch (error) {
            console.error('Error fetching project automation rules:', error);
            return errorResponse(res, 500, 'Failed to fetch project automation rules', error.message);
        }
    }

    static async updateTenantRule(req, res) {
        try {
            const { tenantId, ruleId } = req.params;
            const data = req.body;

            const updated = await AutomationService.updateTenantRule(ruleId, data, tenantId);

            return successResponse(res, 200, 'Tenant automation rule updated successfully', { updated });
        } catch (error) {
            console.error('Error updating tenant automation rule:', error);
            return errorResponse(res, 500, 'Failed to update tenant automation rule', error.message);
        }
    }

    static async updateProjectRule(req, res) {
        try {
            const { tenantId, projectId, ruleId } = req.params;
            const data = req.body;

            const updated = await AutomationService.updateProjectRule(ruleId, data, tenantId, projectId);

            return successResponse(res, 200, 'Project automation rule updated successfully', { updated });
        } catch (error) {
            console.error('Error updating project automation rule:', error);
            return errorResponse(res, 500, 'Failed to update project automation rule', error.message);
        }
    }

    static async deleteRule(req, res) {
        try {
            const { tenantId, ruleId } = req.params;
            await AutomationService.deleteRule(ruleId, { tenantId });

            return successResponse(res, 204, 'Automation rule deleted successfully');
        } catch (error) {
            console.error('Error deleting automation rule:', error);
            return errorResponse(res, 500, 'Failed to delete automation rule', error.message);
        }
    }
}

export default AutomationController;