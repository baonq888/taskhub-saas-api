import ProjectRepository from "./ProjectRepository.js";
import ChatRoomService from "../../chat/chatRoom/chatRoomService.js";
import ChatParticipantService from "../../chat/chatParticipant/chatParticipantService.js";
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
    // Invite user to project (handled in the repository)
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