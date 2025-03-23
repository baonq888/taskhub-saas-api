import prisma from "../../../core/db/index.js";


class ChatRoomRepository {
    static async createChatRoom(projectId) {
      return await prisma.chatRoom.create({ data: { projectId } });
    }
  
    static async findChatRoomByProject(projectId) {
      return await prisma.chatRoom.findUnique({
        where: { projectId },
        include: { messages: true, participants: true },
      });
    }
  
    static async addParticipant(chatRoomId, userId) {
      return await prisma.chatParticipant.create({ data: { chatRoomId, userId } });
    }
  
    static async removeParticipant(chatRoomId, userId) {
      await prisma.chatParticipant.delete({
        where: { userId_chatRoomId: { userId, chatRoomId } },
      });
    }
  
    static async addMessage(chatRoomId, senderId, content) {
      return await prisma.message.create({ data: { chatRoomId, senderId, content } });
    }
  
    static async getMessages(chatRoomId) {
      return await prisma.message.findMany({
        where: { chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }
  }
  
  export default ChatRoomRepository;