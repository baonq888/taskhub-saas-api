import pkg from "jsonwebtoken";
const { verify } = pkg;

function authMiddlewareSocket(socket, next) {
  try {
    const authHeader = socket.handshake.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("Authentication error: No or invalid token format"));
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    const decoded = verify(token, process.env.JWT_SECRET); 

    socket.user = { id: decoded.id, role: decoded.role };

    next(); 
  } catch (error) {
    next(new Error(error.message));
  }
}

export default authMiddlewareSocket;