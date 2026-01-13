import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { authLogger } from "../config/auth-logger";

// Validation Schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 chars"),
  fullName: z.string().min(2),
  role: z.enum(["admin", "user"]),
  employeeId: z.string().uuid().optional()
}); 

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}); 

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    try {
      const user = await this.authService.register(validatedData);
      
      authLogger.info('User registration successful', {
        userId: user.id,
        email: validatedData.email,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        registrationMethod: 'standard'
      });
      
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      authLogger.warn('Registration attempt failed', {
        email: validatedData.email,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        reason: error.message
      });
      
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    try {
      const result = await this.authService.login(validatedData);
      
      authLogger.info('User login successful', {
        userId: result.user.id,
        email: validatedData.email,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        loginMethod: 'standard'
      });
      
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      authLogger.warn('Login attempt failed', {
        email: validatedData.email,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString(),
        reason: error.message
      });
      
      res.status(401).json({ success: false, message: error.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    
    try {
      await this.authService.logout(userId);
      
      authLogger.info('User logout successful', {
        userId,
        ipAddress,
        userAgent,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error: any) {
      authLogger.error('Logout system error', {
        userId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      res.status(500).json({ success: false, message: 'Logout failed' });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  };
}
