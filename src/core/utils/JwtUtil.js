import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

class JwtUtil {
  static ACCESS_TOKEN_EXPIRY = "5h"; 
  static REFRESH_TOKEN_EXPIRY = "1d";

  static generateAccessToken(user) {
    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY } 
    );
  }

  static generateRefreshToken(user) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    const token = sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY } 
    );
    return { token, expiresAt };
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