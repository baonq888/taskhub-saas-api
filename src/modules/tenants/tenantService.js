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


  static async inviteUser(tenantId, email) {
    // check if the user exists by email 
    const user = UserRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return await TenantRepository.inviteUser(tenantId, user);
  }

  static async listTenants() {
    return await TenantRepository.listTenants();
  }

  static async updateTenantUserRole(tenantId, userId, newRole) {
    return await TenantRepository.updateTenantUserRole(tenantId, userId, newRole);
  }
}

export default TenantService;