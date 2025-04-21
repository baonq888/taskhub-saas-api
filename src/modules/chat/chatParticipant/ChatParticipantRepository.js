import prisma from "../../../infrastructure/db/index.js";

class ChatParticipantRepository {
  static async addParticipant(chatRoomId, userId) {
    return await prisma.chatParticipant.create({ data: { chatRoomId, userId } });
  }

  static async removeParticipant(chatRoomId, userId) {
    await prisma.chatParticipant.delete({
      where: { userId_chatRoomId: { userId, chatRoomId } },
    });
  }
}

export default ChatParticipantRepository;