import TenantRepository from "./TenantRepository.js";
import UserRepository from "../auth/UserRepository.js";
class TenantService {
  static async createTenant(userId, name) {
    // create tenant and update user to tenant owner
    return await TenantRepository.createTenant(name, userId);
  }

  static async getTenant(id) {
    return await TenantRepository.findTenantById(id);
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
    return await TenantRepository.listTenants();
  }

  static async updateTenantUserRole(tenantId, userId, newRole) {
    if (!["TENANT_MEMBER", "TENANT_ADMIN", "TENANT_OWNER"].includes(newRole)) {
      throw new Error("Invalid role");
    }
    return await TenantRepository.updateTenantUserRole(tenantId, userId, newRole);
  }
}

export default TenantService;