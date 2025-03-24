import prisma from "../../../core/db/index.js";

class ChatMessageRepository {
  static async createMessage(chatRoomId, senderId, content) {
    return await prisma.message.create({
      data: { chatRoomId, senderId, content },
    });
  }

  static async getMessagesByChatRoom(chatRoomId) {
    return await prisma.message.findMany({
      where: { chatRoomId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async getMessageById(id) {
    return await prisma.message.findUnique({ where: { id } });
  }

  static async updateMessage(id, content) {
    return await prisma.message.update({
      where: { id },
      data: { content },
    });
  }

  static async deleteMessage(id) {
    return await prisma.message.delete({ where: { id } });
  }
}

export default ChatMessageRepository;