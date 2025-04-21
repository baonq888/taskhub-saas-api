import prisma from "../../../infrastructure/db/index.js";


class ChatRoomRepository {
    static async createChatRoom(projectId) {
      return  prisma.chatRoom.create({ data: { projectId } });
    }
  
    static async findChatRoomByProject(projectId) {
      return prisma.chatRoom.findFirst({
        where: { projectId },
        include: { messages: true, participants: true },
      });
    }
  
    static async addParticipant(chatRoomId, userId) {
      return prisma.chatParticipant.create({ data: { chatRoomId, userId } });
    }
  
    static async removeParticipant(chatRoomId, userId) {
      await prisma.chatParticipant.delete({
        where: { userId_chatRoomId: { userId, chatRoomId } },
      });
    }
  
    static async addMessage(chatRoomId, senderId, content) {
      return prisma.message.create({ data: { chatRoomId, senderId, content } });
    }
  
    static async getMessages(chatRoomId) {
      return prisma.message.findMany({
        where: { chatRoomId },
        orderBy: { createdAt: "asc" },
      });
    }
  }
  
  export default ChatRoomRepository;