import UserDetailDTO from "./dto/UserDetailDTO.js";
import UserDetailRepository from "./UserDetailRepository.js";

class UserService {
  static async getUserDetails(userId) {
    const user = await UserDetailRepository.getUserWithDetails(userId);

    if (!user) throw new Error("User not found");
    return new UserDetailDTO(user);
  }

  static async getAllUsers() {
    const users = await UserDetailRepository.getAllUsers();

    return users.map((user) => new UserDetailDTO(user));
  }
}

export default UserService;