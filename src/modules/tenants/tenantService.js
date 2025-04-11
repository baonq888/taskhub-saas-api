import TenantRepository from "./TenantRepository.js";
import UserRepository from "../auth/UserRepository.js";
import {checkUserInTenant} from "../../core/helpers/EntityExistenceHelper.js";
class TenantService {
  static async createTenant(userId, name) {
    // Check if the tenant already exists
    const existingTenant = await TenantRepository.getTenantByName(name);
    if (existingTenant) {
      throw new Error(`Tenant with name "${name}" already exists`);
    }
    // create tenant and update user to tenant owner
    return await TenantRepository.createTenant(name, userId);
  }

  static async getTenant(id) {
    return await TenantRepository.getTenantById(id);
  }

  static async getTenantUser(tenantId, userId) {
    return await TenantRepository.getTenantUser(tenantId,userId)
  }


  static async inviteUsers(tenantId, emails) {
    const invitedUsers = [];
    for (const email of emails) {
      const user = await UserRepository.findUserByEmail(email);
      if (!user) {
        console.warn(`User with email ${email} not found, skipping.`);
        continue;
      }
      const result = await TenantRepository.inviteUser(tenantId, user);
      invitedUsers.push(result);
    }
    return invitedUsers;
  }

  static async listTenants() {
    return TenantRepository.listTenants();
  }

  static async updateTenantUserRole(tenantId, userId, newRole) {
    if (!["TENANT_MEMBER", "TENANT_ADMIN", "TENANT_OWNER"].includes(newRole)) {
      throw new Error("Invalid role");
    }
    // check user belongs to tenant
    await checkUserInTenant(userId, tenantId);
    return await TenantRepository.updateTenantUserRole(tenantId, userId, newRole);
  }
}

export default TenantService;