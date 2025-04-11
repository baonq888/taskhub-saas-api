import ProjectRepository from "./ProjectRepository.js";
import UserRepository from "../../auth/UserRepository.js";
import ChatRoomService from "../../chat/chatRoom/chatRoomService.js";
import ChatParticipantService from "../../chat/chatParticipant/chatParticipantService.js";
import TenantService from "../../tenants/tenantService.js";
import {
  checkProjectExists,
  checkProjectExistsByName,
  checkTenantExists, checkUserExist, checkUserInProject, checkUserInTenant
} from "../../../core/helpers/EntityExistenceHelper.js";
import {ProjectRole} from "@prisma/client";

class ProjectService {
  static async createProject(tenantId, data) {
    if (!tenantId || !data.name) {
      throw new Error("tenantId and project name are required");
    }
    // Check if a project with the same name already exists in the tenant
    await checkProjectExistsByName(tenantId, data.name);

    const projectData = { ...data, tenantId };
    const project = await ProjectRepository.createProject(projectData);
    await ChatRoomService.createChatRoomForProject(project.id);
    return project;
  }

  static async getProjectById(tenantId, projectId) {
    const tenant = await TenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    return ProjectRepository.getProjectById(projectId);
  }

  static async getAllProjects(tenantId) {
    const tenant = await TenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    return ProjectRepository.getAllProjects(tenantId);
  }

  static async updateProject(tenantId, projectId, data) {
    const tenant = await TenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    return ProjectRepository.updateProject(projectId, data);
  }

  static async deleteProject(tenantId, projectId) {
    await checkTenantExists(tenantId);
    return ProjectRepository.deleteProject(projectId);
  }
 
  static async inviteUsersToProject(tenantId, projectId,emails) {
    if (!Array.isArray(emails) || emails.length === 0) {
      throw new Error("Please provide a valid list of emails.");
    }
    const users = [];
    for (const email of emails) {
      const user = await UserRepository.findUserByEmail(email); 
      if (!user) {
        throw new Error(`User with email ${email} not found.`);
      }
      users.push(user);
    }
    // Check if project exists
    await checkProjectExists(projectId);
    // Check if tenant exists
    await checkTenantExists(tenantId);
    // Invite each user to the project and add them to the chat room
    for (const user of users) {

      const tenantUser = await TenantService.getTenantUser(tenantId, user.id);
      if (!tenantUser) {
        throw new Error(`User with email ${user.email} is not a member of the tenant`);
      }
      // Invite user to project
      await ProjectRepository.inviteUserToProject(projectId, user.id);
      // Add user to chat room participants
      const chatRoom = await ChatRoomService.getChatRoomByProject(projectId);
      if (chatRoom) {
        await ChatParticipantService.addUserToChatRoom(chatRoom.id, user.id);
      }

    }

    return { message: "Users invited to project and added to chat room" };
  }

  static async updateProjectUserRole(tenantId, projectId, userId, newRole) {
    if (![ProjectRole.PROJECT_MEMBER, ProjectRole.PROJECT_ADMIN, ProjectRole.PROJECT_OWNER].includes(newRole)) {
      throw new Error("Invalid role");
    }
    // Check if user exists
    await checkUserExist(userId);
    // Check if user is already in the tenant
    await checkTenantExists(tenantId);
    await checkUserInTenant(userId, tenantId);
    await checkUserInProject(userId, projectId);
    await ProjectRepository.updateProjectUserRole(projectId, userId, newRole)
  }
}

export default ProjectService;