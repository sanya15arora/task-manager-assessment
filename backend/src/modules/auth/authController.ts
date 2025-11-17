import { Request, Response, NextFunction } from "express";
import { AuthService } from "./authService";
import { registerSchema, loginSchema } from "./authValidation";
import { verifyRefreshToken } from "../../utils/jwt";

const REFRESH_COOKIE_NAME = "jid";

export class AuthController {
    // REGISTER
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = registerSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: parsed.error.issues
                });
            }

            const { name, email, password } = parsed.data;
            const user = await AuthService.register(name, email, password);

            return res.status(201).json({ user });
        } catch (err) {
            next(err);
        }
    }

    // LOGIN
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = loginSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: parsed.error.issues
                });
            }

            const { email, password } = parsed.data;
            const { accessToken, refreshToken, user } = await AuthService.login(email, password);

            const payload = verifyRefreshToken(refreshToken);

            res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(payload.exp * 1000),
                path: "/",
            });

            return res.json({ accessToken, user });
        } catch (err) {
            next(err);
        }
    }

    // REFRESH ACCESS TOKEN
    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies[REFRESH_COOKIE_NAME];
            if (!token) {
                return res.status(401).json({ message: "Missing refresh token" });
            }

            const { accessToken, refreshToken, user } = await AuthService.rotateRefreshToken(token);
            const payload = verifyRefreshToken(refreshToken);

            res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(payload.exp * 1000),
                path: "/",
            });

            return res.json({ accessToken, user });
        } catch (err: any) {
            if (err.status === 401) {
                return res.status(401).json({ message: "Invalid or expired refresh token" });
            }
            next(err);
        }
    }

    // LOGOUT
    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies[REFRESH_COOKIE_NAME];
            if (token) {
                await AuthService.revokeRefreshToken(token);
            }

            res.clearCookie(REFRESH_COOKIE_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            return res.json({ ok: true });
        } catch (err) {
            next(err);
        }
    }
}