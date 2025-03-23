import ProjectRepository from "./ProjectRepository.js";
import ChatRoomService from "../../chat/chatRoom/chatRoomService.js";
import ChatParticipantService from "../../chat/chatParticipant/chatParticipantService.js";
import UserService from "../../user/userService.js";
import TenantService from "../../tenants/tenantService.js";

class ProjectService {
  static async createProject(data) {
    // Create project
    const project = await ProjectRepository.createProject(data);

    // Create a chat room for the project
    await ChatRoomService.createChatRoomForProject(project.id);

    return project;
  }

  static async getProjectById(id) {
    return ProjectRepository.getProjectById(id);
  }

  static async getAllProjects() {
    return ProjectRepository.getAllProjects();
  }

  static async updateProject(id, data) {
    return ProjectRepository.updateProject(id, data);
  }

  static async deleteProject(id) {
    return ProjectRepository.deleteProject(id);
  }
 
static async inviteUserToProject(projectId, userId) {
  // Check if project exists
  const project = await ProjectRepository.getProjectById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Check if user exists
  const user = await UserService.getUserDetails(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is already in the tenant
  const tenant = await TenantService.getTenant(project.tenantId);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const tenantUser = tenant.users.find((u) => u.id === userId);
  if (!tenantUser) {
    throw new Error("User is not a member of the tenant");
  }

  // Invite user to project
  await ProjectRepository.inviteUserToProject(projectId, userId);

  // Add user to chat room participants
  const chatRoom = await ChatRoomService.getChatRoomByProject(projectId);
  if (chatRoom) {
    await ChatParticipantService.addUserToChatRoom(chatRoom.id, userId);
  }

  return { message: "User invited to project and added to chat room" };
}
}

export default ProjectService;