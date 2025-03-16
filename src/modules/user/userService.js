import UserDetailDTO from "./dto/UserDetailDTO";
import UserDetailRepository from "./UserDetailRepository";

class UserService {
  static async getUserDetails(userId) {
    const user = await UserDetailRepository.getUserWithDetails(userId);

    if (!user) throw new Error("User not found");
    return new UserDetailDTO(user);
  }

  static async getAllUsers(role) {
    const users = await UserDetailRepository.getUsersByRole(role);

    return users.map((user) => new UserDetailDTO(user));
  }
}

export default UserService;