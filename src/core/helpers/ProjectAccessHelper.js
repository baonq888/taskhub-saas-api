import ProjectRepository from "../../modules/tasks/projects/ProjectRepository.js";
import TenantRepository from "../../modules/tenants/TenantRepository.js";

class ProjectAccessHelper {
    static async verifyUserInProject(userId, projectId) {
        const project = await ProjectRepository.getProjectById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const userInTenant = await TenantRepository.getTenantUser(project.tenantId, userId);
        if (!userInTenant) {
            throw new Error("User does not belong to the same tenant");
        }

        const userInProject = await ProjectRepository.getProjectUser(projectId, userId);
        if (!userInProject) {
            throw new Error("User does not belong to this project");
        }

        return true; // Return project if checks pass
    }

    static async verifyUsersInSameTenant(projectAdminId, projectMemberId) {
        const tenantsA = await TenantRepository.getUserTenants(projectAdminId);
        const tenantsB = await TenantRepository.getUserTenants(projectMemberId);

        const sharedTenant = tenantsA.find(t =>
            tenantsB.some(u => u.tenantId === t.tenantId)
        );

        if (!sharedTenant) {
            throw new Error(`Users ${projectAdminId} and ${projectMemberId} are not in the same tenant`);
        }
    }
}

export default ProjectAccessHelper;