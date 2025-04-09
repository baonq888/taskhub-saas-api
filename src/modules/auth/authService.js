import { hash, compare } from "bcryptjs";
import UserRepository from "./UserRepository.js";
import JwtUtil from "../../core/utils/JwtUtil.js";

class AuthService {
  static async registerUser(email, password) {
    const hashedPassword = await hash(password, 10);
    return await UserRepository.createUser(email, hashedPassword);
  }

  static async loginUser(email, password) {
    const user = await UserRepository.findUserByEmail(email);
    if (!user || !(await compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    // Generate tokens
    const accessToken = JwtUtil.generateAccessToken(user);
    const refreshToken = JwtUtil.generateRefreshToken(user);
    // Store refresh token in DB
    await UserRepository.storeRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);
    const storedToken = await UserRepository.findRefreshToken(decoded.id, refreshToken);
    if (!storedToken) {
      throw new Error("Invalid or expired refresh token");
    }
    const user = await UserRepository.findUserById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    return JwtUtil.generateAccessToken(user);
  }

  static async logoutUser(userId, refreshToken) {
    return await UserRepository.deleteRefreshToken(userId, refreshToken);
  }

}

export default AuthService;