import AuthService from "./authService.js";

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
      const { accessToken, refreshToken } = await AuthService.loginUser(email, password);
      res.status(200).json({ message: "Login successful", accessToken, refreshToken });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
      }

      const accessToken = await AuthService.refreshAccessToken(refreshToken);
      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  
}

export default AuthController;