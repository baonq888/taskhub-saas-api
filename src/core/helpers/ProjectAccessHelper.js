import TenantRepository from "../../modules/tenants/TenantRepository.js";
import {checkProjectExists, checkUserInProject, checkUserInTenant} from "./EntityExistenceHelper.js";

class ProjectAccessHelper {
    static async verifyUserInProject(userId, projectId) {

        const project = await checkProjectExists(projectId);
        await checkUserInTenant(userId, project.tenantId);
        await checkUserInProject(userId, projectId);

        return true;
    }

    static async verifyMultipleUsersInProjectAndTenant(adminId, userIds, projectId) {
        await Promise.all(
            userIds.map(userId =>
                this.verifyUserInProject(userId, projectId) // Includes tenant check
            )
        );

        await Promise.all(
            userIds.map(userId =>
                this.verifyUsersInSameTenant(adminId, userId)
            )
        );
    }

    static async verifyUsersInSameTenant(projectAdminId, projectMemberId) {
        const tenantsOfAdmin = await TenantRepository.getUserTenants(projectAdminId);
        const tenantsOfUser = await TenantRepository.getUserTenants(projectMemberId);

        const tenantIdsOfUser = new Set(tenantsOfUser.map(u => u.tenantId));
        // Array Lookups are O(1)
        const hasSharedTenant = tenantsOfAdmin.some(t => tenantIdsOfUser.has(t.tenantId));

        if (!hasSharedTenant) {
            throw new Error(`Users ${projectAdminId} and ${projectMemberId} are not in the same tenant`);
        }
    }

    static async verifyAdminAndUsersInProjectAndTenant(adminId, userIds, projectId) {
        // Ensure admin is in the project (also implies they're in the tenant)
        await this.verifyUserInProject(adminId, projectId);

        // Ensure users are in the same tenant and project
        await this.verifyMultipleUsersInProjectAndTenant(adminId, userIds, projectId);
    }
}

export default ProjectAccessHelper;