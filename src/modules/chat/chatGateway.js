import authMiddlewareSocket from "../../core/middleware/authMiddlewareSocket.js";
import ChatMessageService from "../chat/chatMessage/chatMessageService.js";
import ChatRoomRepository from "../chat/chatRoom/ChatRoomRepository.js";


function setupChat(io) {
    const chatNamespace = io.of("/chat");

    chatNamespace.use(authMiddlewareSocket);

    chatNamespace.on("connection", async (socket) => {
        const userId = socket.user.id;
        let projectId;
        let chatRoomId;

        socket.on("join_project", async ({ projectId: projId }) => {
            projectId = projId;
            socket.join(projectId);

            try {
    
                const chatRoom = await ChatRoomRepository.findChatRoomByProject(projectId);
                if (!chatRoom) {
                    console.warn(`Chat room for project ${projectId} not found.`);
                    socket.emit("error", { message: "Chat room not found" });
                    return;
                }

                chatRoomId = chatRoom.id;

                const messages = await ChatMessageService.getMessagesByChatRoom(chatRoomId);
                socket.emit("chat_history", messages);
            } catch (error) {
                console.error("Error joining project chat:", error);
                socket.emit("error", { message: "Could not join chat room" });
            }
        });

        socket.on("send_message", async ({ tempId, message }) => {
            if (!chatRoomId) {
                socket.emit("error", { message: "Chat room not initialized" });
                return;
            }

            const tempMessage = {
                id: tempId, // Temporary ID from client
                chatRoomId,
                senderId: userId,
                content: message,
                createdAt: new Date(),
            };

            chatNamespace.to(projectId).emit("receive_message", tempMessage);

            // Store message in the database in the background
            ChatMessageService.createMessage(chatRoomId, userId, message)
                .then((savedMessage) => {
                    // Notify clients to replace temp message with the real one
                    socket.emit("message_saved", { tempId, newMessage: savedMessage });
                })
                .catch((error) => {
                    console.error("Error storing message:", error);
                    socket.emit("message_error", { tempId, message: "Failed to save message" });
                });
        });

        socket.on("disconnect", () => {
            if (projectId) {
                socket.leave(projectId);
            }
        });
    });

    console.log("Chat Gateway initialized!");
}
export default setupChat;