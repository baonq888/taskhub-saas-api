import TaskRepository from "../../modules/tasks/tasks/TaskRepository.js";
import BoardRepository from "../../modules/tasks/boards/BoardRepository.js";
import ProjectRepository from "../../modules/tasks/projects/ProjectRepository.js";
import TenantRepository from "../../modules/tenants/TenantRepository.js";

export async function checkTaskExist(taskId) {
    const task = await TaskRepository.getTaskById(taskId);
    if (!task) {
        throw new Error("Task not found");
    }
    return task;
}

export async function checkBoardExist(boardId) {
    const board = await BoardRepository.getBoardById(boardId);
    if (!board) {
        throw new Error("Board not found");
    }
    return board;
}

export async function checkProjectExists(projectId) {
    const project = await ProjectRepository.getProjectById(projectId);
    if (!project) {
        throw new Error("Project not found");
    }
    return project;
}

export async function checkProjectExistsByName(tenantId, projectName) {
    const existingProject = await ProjectRepository.getProjectByName(tenantId, projectName);
    if (!existingProject) {
        throw new Error(`Project with name "${projectName}" not found in tenant`);
    }
    return existingProject;
}

export async function checkTenantExists(tenantId) {
    const tenant = await TenantRepository.getTenantById(tenantId);
    if (!tenant) {
        throw new Error("Tenant not found");
    }
    return tenant;
}

export async function checkTenantExistsByName(name) {
    const tenant = await TenantRepository.getTenantByName(name);
    if (!tenant) {
        throw new Error(`Tenant with name "${name}" not found`);
    }
    return tenant;
}

export async function checkUserInTenant(userId, tenantId) {
    const user = await TenantRepository.getTenantUser(tenantId, userId);
    if (!user) throw new Error("User does not belong to the specified tenant");
    return user;
}

export async function checkUserInProject(userId, projectId) {
    const user = await ProjectRepository.getProjectUser(projectId, userId);
    if (!user) {
        throw new Error("User does not belong to this project");
    }
    return user;
}