import TenantRepository from "./TenantRepository.js";

class TenantService {
  static async createTenant(userId, name) {
    return await TenantRepository.createTenant(name, userId);
  }

  static async getTenant(id) {
    return await TenantRepository.findTenantById(id);
  }

  static async inviteUser(tenantId, email) {
    return await TenantRepository.inviteUser(tenantId, email);
  }

  static async listTenants() {
    return await TenantRepository.listTenants();
  }
}

export default TenantService;