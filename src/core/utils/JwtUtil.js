import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

class JwtUtil {
  static generateAccessToken(user) {
    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Access token valid for 1 hour
    );
  }

  static generateRefreshToken(user) {
    return sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Refresh token valid for 7 days
    );
  }

  static verifyAccessToken(token) {
    try {
      return verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static verifyRefreshToken(token) {
    try {
      return verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default JwtUtil;