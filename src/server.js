import { createServer } from "http";
import app from "./app.js";
import setupSocket from "./socketServer.js";


const PORT = process.env.PORT || 3000;

const server = createServer(app);

setupSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Server shutting down...");
  server.close(() => process.exit(0));
});