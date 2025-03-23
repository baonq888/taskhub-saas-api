import ChatParticipantRepository from "./ChatParticipantRepository.js";

class ChatParticipantService {
  async addUserToChatRoom(chatRoomId, userId) {
    if (chatRoomId) {
      return await ChatParticipantRepository.addParticipant(chatRoomId, userId);
    }
    return null;
  }
}

export default new ChatParticipantService();