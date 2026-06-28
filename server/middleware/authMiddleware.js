import jwt from 'jsonwebtoken';

/* const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user
        next(); // 🔥 pass control
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}; */


export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
