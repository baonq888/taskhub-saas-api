import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import UserRepository from "./UserRepository";

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

    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }
}

export default AuthService;