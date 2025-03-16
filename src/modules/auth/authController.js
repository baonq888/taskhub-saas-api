import AuthService from "./authService";

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.registerUser(email, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.loginUser(email, password);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default AuthController;