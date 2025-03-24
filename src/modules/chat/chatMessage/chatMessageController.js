import ChatMessageService from "./chatMessageService.js";

class ChatMessageController {
  static async createMessage(req, res) {
    try {
      const { chatRoomId, senderId, content } = req.body;
      const message = await ChatMessageService.createMessage(chatRoomId, senderId, content);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMessagesByChatRoom(req, res) {
    try {
      const { chatRoomId } = req.params;
      const messages = await ChatMessageService.getMessagesByChatRoom(chatRoomId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMessageById(req, res) {
    try {
      const { id } = req.params;
      const message = await ChatMessageService.getMessageById(id);
      if (!message) return res.status(404).json({ message: "Message not found" });
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMessage(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const updatedMessage = await ChatMessageService.updateMessage(id, content);
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      await ChatMessageService.deleteMessage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ChatMessageController;