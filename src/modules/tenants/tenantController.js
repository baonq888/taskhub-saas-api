import TenantService from "./tenantService.js";

class TenantController {
  static async createTenant(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.id; 

      const tenant = await TenantService.createTenant(userId, name);
      res.status(201).json({ message: "Tenant created", tenant });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTenant(req, res) {
    try {
      const { id } = req.params;
      const tenant = await TenantService.getTenant(id);
      res.status(200).json(tenant);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async inviteUser(req, res) {
    try {
      const { email } = req.body;
      const { id: tenantId } = req.params;

      await TenantService.inviteUser(tenantId, email);
      res.status(200).json({ message: "User invited" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async listTenants(req, res) {
    try {
      const tenants = await TenantService.listTenants();
      res.status(200).json(tenants);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTenantUserRole(req, res) {
    try {
      const { tenantId, userId } = req.params;
      const { newRole } = req.body;

      await TenantService.updateTenantUserRole(tenantId, userId, newRole);
      res.status(200).json({ message: "User role updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default TenantController;