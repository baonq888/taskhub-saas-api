import ChatRoomRepository from "./ChatRoomRepository.js";

class ChatRoomService {
  static async createChatRoomForProject(projectId) {
    return await ChatRoomRepository.createChatRoom(projectId);
  }

  static async getChatRoomByProject(projectId) {
    return await ChatRoomRepository.findChatRoomByProject(projectId);
  }

  static async joinChatRoom(chatRoomId, userId) {
    return await ChatRoomRepository.addParticipant(chatRoomId, userId);
  }

  static async leaveChatRoom(chatRoomId, userId) {
    return await ChatRoomRepository.removeParticipant(chatRoomId, userId);
  }

  static async sendMessage(chatRoomId, senderId, content) {
    return await ChatRoomRepository.addMessage(chatRoomId, senderId, content);
  }

  static async fetchMessages(chatRoomId) {
    return await ChatRoomRepository.getMessages(chatRoomId);
  }
}

export default ChatRoomService;