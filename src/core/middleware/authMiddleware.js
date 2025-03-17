import pkg from 'jsonwebtoken';
const { verify } = pkg;

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verify(token, process.env.JWT_SECRET);
    
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

export default authMiddleware;