import TaskRepository from "./TaskRepository.js";
import TenantRepository from "../../tenants/TenantRepository.js";

class TaskService {
  async createTask(data) {
    return TaskRepository.createTask(data);
  }

  async assignTask(taskId, assignedUserId, adminUserId) {
    // Get tenant of the assigned user
    const userTenants = await TenantRepository.getUserTenants(assignedUserId);
    
    if (!userTenants.length) {
      throw new Error("User does not belong to any tenant.");
    }

    // Ensure admin and user are in the same tenant
    const adminTenants = await TenantRepository.getUserTenants(adminUserId);
    const sharedTenant = adminTenants.find(t => userTenants.some(u => u.tenantId === t.tenantId));

    if (!sharedTenant) {
      throw new Error("User is not in the same tenant.");
    }

    // Assign task
    return TaskRepository.assignTask(taskId, assignedUserId);
  }

  async getTaskById(id) {
    return TaskRepository.getTaskById(id);
  }

  async getAllTasks() {
    return TaskRepository.getAllTasks();
  }

  async updateTask(id, data) {
    return TaskRepository.updateTask(id, data);
  }

  async deleteTask(id) {
    return TaskRepository.deleteTask(id);
  }
}

export default new TaskService();