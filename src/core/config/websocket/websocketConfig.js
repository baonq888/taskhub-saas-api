import { Server } from "socket.io";

function setupSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" },
    });

    return io;
}

export default setupSocket;