import { createServer } from "https";
import fs from "fs";
import app from "./app.js";
import setupSocket from "./core/config/websocket/websocketConfig.js";
import loadWebSockets from "./core/config/websocket/index.js";

const PORT = process.env.PORT || 3000;

// Load the certificate and private key
const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem'),
};

// Create the HTTPS server with the options (SSL certificate and key)
const server = createServer(options, app);

// Set up WebSocket with the server
const io = setupSocket(server);

loadWebSockets(io);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log("Server shutting down...");
  server.close(() => process.exit(0));
});