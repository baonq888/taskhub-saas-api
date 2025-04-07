import TaskRepository from "./TaskRepository.js";
import TenantRepository from "../../tenants/TenantRepository.js";

class TaskService {
  static async createTask(data) {
    const existingTask = await TaskRepository.getTaskByTitle(data.boardId, data.title);

    if (existingTask) {
      throw new Error("A task with this title already exists in the project");
    }
    return TaskRepository.createTask(data);
  }

  static async assignTask(taskId, assignedUserIds, adminUserId) {
    // Ensure assignedUserIds is an array
    if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      throw new Error("assignedUserIds must be a non-empty array.");
    }

    // Fetch tenants for all assigned users
    const userTenantsMap = await Promise.all(
      assignedUserIds.map(userId => TenantRepository.getUserTenants(userId))
    );

    // Check if all users belong to a tenant
    userTenantsMap.forEach((userTenants, index) => {
      if (!userTenants.length) {
        throw new Error(`User ${assignedUserIds[index]} does not belong to any tenant.`);
      }
    });

    // Fetch admin's tenants
    const adminTenants = await TenantRepository.getUserTenants(adminUserId);

    // Ensure all users share at least one tenant with the admin
    assignedUserIds.forEach((userId, index) => {
      const userTenants = userTenantsMap[index];
      const sharedTenant = adminTenants.find(t => userTenants.some(u => u.tenantId === t.tenantId));

      if (!sharedTenant) {
        throw new Error(`User ${userId} is not in the same tenant as the admin.`);
      }
    });

    // Assign all users to the task
    return Promise.all(
      assignedUserIds.map(userId => TaskRepository.assignTask(taskId, userId))
    );
  }

  static async unassignTask(taskId, userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("userIds must be a non-empty array.");
    }

    return Promise.all(
      userIds.map(userId => TaskRepository.unassignTask(taskId, userId))
    );
  }
  static async getTaskById(id) {
    return TaskRepository.getTaskById(id);
  }

  static async getAllTasks() {
    return TaskRepository.getAllTasks();
  }

  static async updateTask(id, data) {
    return TaskRepository.updateTask(id, data);
  }

  static async deleteTask(id) {
    return TaskRepository.deleteTask(id);
  }
}

export default TaskService;