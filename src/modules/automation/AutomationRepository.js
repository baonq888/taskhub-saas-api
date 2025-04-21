import prisma from '../../infrastructure/db/index.js';

class AutomationRepository {
    static async createForTenant(tenantId, data) {
        return prisma.automationRule.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    static async createForProject(tenantId, projectId, data) {
        return prisma.automationRule.create({
            data: {
                ...data,
                tenantId,
                projectId,
            },
        });
    }

    static async findByTenant(tenantId) {
        return prisma.automationRule.findMany({ where: { tenantId } });
    }

    static async findByProject(projectId) {
        return prisma.automationRule.findMany({ where: { projectId } });
    }

    static async updateForTenant(id, tenantId, data) {
        return prisma.automationRule.updateMany({
            where: {
                id,
                tenantId,
                projectId: null,
            },
            data,
        });
    }

    static async updateForProject(id, tenantId, projectId, data) {
        return prisma.automationRule.updateMany({
            where: {
                id,
                tenantId,
                projectId,
            },
            data,
        });
    }

    static async remove(id, tenantId) {
        return prisma.automationRule.deleteMany({
            where: { id, tenantId },
        });
    }
}

export default AutomationRepository;