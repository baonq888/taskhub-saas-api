import UserService from "./userService.js";

class UserController {
  static async getUserDetails(req, res) {
    try {
      const userDetails = await UserService.getUserDetails(req.user.id);
      res.json(userDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { userId } = req.params;
      const userDetails = await UserService.getUserDetails(userId);
      res.json(userDetails);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;