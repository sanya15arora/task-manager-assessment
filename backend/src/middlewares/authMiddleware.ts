import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email?: string;
    };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - missing token" });
        }

        const token = header.split(" ")[1];

        // verify access token
        const payload = verifyAccessToken(token);

        // attach user info to request
        req.user = { userId: (payload as any).userId, email: (payload as any).email };

        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }

        return res.status(401).json({ message: "Invalid access token" });
    }
}
