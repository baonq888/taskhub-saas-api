import pkg from "jsonwebtoken";
const { verify } = pkg;

function authMiddlewareSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token; // Get token from handshake auth

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    // Attach user data to the socket for future use
    socket.user = { id: decoded.id, role: decoded.role };

    next(); // Proceed to connection handler
  } catch (error) {
    next(new Error(error.message));
  }
}

export default authMiddlewareSocket;