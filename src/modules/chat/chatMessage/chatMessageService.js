import ChatMessageRepository from "./ChatMessageRepository.js";

class ChatMessageService {
  static async createMessage(chatRoomId, senderId, content) {
    return await ChatMessageRepository.createMessage(chatRoomId, senderId, content);
  }

  static async getMessagesByChatRoom(chatRoomId) {
    return await ChatMessageRepository.getMessagesByChatRoom(chatRoomId);
  }

  static async getMessageById(id) {
    return await ChatMessageRepository.getMessageById(id);
  }

  static async updateMessage(id, content) {
    return await ChatMessageRepository.updateMessage(id, content);
  }

  static async deleteMessage(id) {
    return await ChatMessageRepository.deleteMessage(id);
  }
}

export default ChatMessageService;