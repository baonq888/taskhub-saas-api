import express from "express";
import ChatMessageController from "./chatMessage/chatMessageController.js";

const router = express.Router();

router.post("/", ChatMessageController.createMessage);
router.get("/:chatRoomId", ChatMessageController.getMessagesByChatRoom);
router.get("/message/:id", ChatMessageController.getMessageById);
router.put("/message/:id", ChatMessageController.updateMessage);
router.delete("/message/:id", ChatMessageController.deleteMessage);

export default router;