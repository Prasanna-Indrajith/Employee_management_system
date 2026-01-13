// Authentication middleware for JWT token validation
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"] as string;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied: No Token Provided" });
  }

  // --- FIX BELOW ---
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or Expired Token" });
    }

    (req as any).user = user;
    next();
  }); // <--- Added the missing closing parenthesis ')' here
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Access Denied: Admins Only" });
  }
};
